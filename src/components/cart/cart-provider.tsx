"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addToCartAction,
  getCartAction,
  removeCartLineAction,
  updateCartLineAction,
  type CartResult,
} from "@/app/actions/cart";
import type { ArtSpec, Cart, CartLine, Money, SelectedOption, ShopImage } from "@/lib/shop/types";
import { moneyFrom } from "@/lib/utils";

/** O que o modo demonstração precisa saber da linha (a Shopify só precisa do id). */
export type LinePreview = {
  variantTitle: string;
  selectedOptions: SelectedOption[];
  productHandle: string;
  productTitle: string;
  image: ShopImage | null;
  art?: ArtSpec;
  unitPrice: Money;
  compareAtUnitPrice: Money | null;
};

export type AddItemInput = { variantId: string; quantity?: number; preview: LinePreview };

type CartContextValue = {
  cart: Cart | null;
  isOpen: boolean;
  isPending: boolean;
  error: string | null;
  isDemo: boolean;
  open: () => void;
  close: () => void;
  addItem: (input: AddItemInput) => Promise<boolean>;
  setQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
};

/**
 * Valor usado fora do <CartProvider>. Acontece na validação "instant" do Next em
 * desenvolvimento, que renderiza o segmento da página isolado do layout. Os
 * consumidores só leem o carrinho em eventos, então a saída do HTML não muda.
 */
const outsideProvider: CartContextValue = {
  cart: null,
  isOpen: false,
  isPending: false,
  error: null,
  isDemo: false,
  open: () => {},
  close: () => {},
  addItem: async () => false,
  setQuantity: async () => {},
  removeLine: async () => {},
};

const CartContext = createContext<CartContextValue>(outsideProvider);

const STORAGE_KEY = "volt-demo-cart-v1";

function readDemoCart(): Cart | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Cart) : null;
  } catch {
    return null;
  }
}

function writeDemoCart(cart: Cart | null) {
  try {
    if (cart && cart.lines.length > 0) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // armazenamento bloqueado: o carrinho de demonstração só não persiste
  }
}

function buildDemoCart(lines: CartLine[]): Cart {
  const currency = lines[0]?.unitPrice.currencyCode ?? "BRL";
  const total = moneyFrom(
    lines.reduce((sum, line) => sum + Number(line.totalPrice.amount), 0),
    currency,
  );
  return {
    id: "demo",
    checkoutUrl: null,
    totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: total,
    total,
    lines,
  };
}

function withQuantity(line: CartLine, quantity: number): CartLine {
  return {
    ...line,
    quantity,
    totalPrice: moneyFrom(Number(line.unitPrice.amount) * quantity, line.unitPrice.currencyCode),
  };
}

export function CartProvider({ shopify, children }: { shopify: boolean; children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Carrinho lido só no navegador: mantém as páginas 100% estáticas (e com cache).
  useEffect(() => {
    let active = true;
    (async () => {
      const initial = shopify
        ? await getCartAction().then((result) => (result.ok ? result.cart : null))
        : readDemoCart();
      if (!active) return;
      setCart(initial);
      setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, [shopify]);

  useEffect(() => {
    if (!shopify && loaded) writeDemoCart(cart);
  }, [cart, loaded, shopify]);

  useEffect(() => {
    if (!error) return;
    const timer = window.setTimeout(() => setError(null), 6000);
    return () => window.clearTimeout(timer);
  }, [error]);

  const run = useCallback(async (action: () => Promise<CartResult>) => {
    setIsPending(true);
    setError(null);
    try {
      const result = await action();
      if (result.ok) {
        setCart(result.cart);
        return true;
      }
      setError(result.error);
      return false;
    } catch {
      setError("Não foi possível atualizar o carrinho. Tente novamente.");
      return false;
    } finally {
      setIsPending(false);
    }
  }, []);

  const addItem = useCallback(
    async ({ variantId, quantity = 1, preview }: AddItemInput) => {
      if (shopify) {
        const ok = await run(() => addToCartAction(variantId, quantity));
        if (ok) setIsOpen(true);
        return ok;
      }
      setCart((current) => {
        const lines = current?.lines ?? [];
        const existing = lines.find((line) => line.variantId === variantId);
        if (existing) {
          return buildDemoCart(
            lines.map((line) =>
              line.id === existing.id ? withQuantity(line, line.quantity + quantity) : line,
            ),
          );
        }
        const line: CartLine = withQuantity(
          { ...preview, id: `demo-${variantId}`, variantId, quantity: 0, totalPrice: preview.unitPrice },
          quantity,
        );
        return buildDemoCart([...lines, line]);
      });
      setIsOpen(true);
      return true;
    },
    [shopify, run],
  );

  const setQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (shopify) {
        await run(() => updateCartLineAction(lineId, quantity));
        return;
      }
      setCart((current) => {
        if (!current) return current;
        const lines =
          quantity <= 0
            ? current.lines.filter((line) => line.id !== lineId)
            : current.lines.map((line) => (line.id === lineId ? withQuantity(line, quantity) : line));
        return buildDemoCart(lines);
      });
    },
    [shopify, run],
  );

  const removeLine = useCallback(
    async (lineId: string) => {
      if (shopify) {
        await run(() => removeCartLineAction(lineId));
        return;
      }
      await setQuantity(lineId, 0);
    },
    [shopify, run, setQuantity],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isOpen,
      isPending,
      error,
      isDemo: !shopify,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      addItem,
      setQuantity,
      removeLine,
    }),
    [cart, isOpen, isPending, error, shopify, addItem, setQuantity, removeLine],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

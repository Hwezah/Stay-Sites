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

import { useUI } from "@/context/ui-context";
import {
  bookingRef,
  fmtDate,
  intlPhone,
  money as formatMoney,
  nightsBetween,
  totals as computeTotals,
  type Currency,
  type Totals,
} from "@/lib/booking";
import {
  CONFIG,
  SERVICES,
  servicePrice,
  getApartment,
  type Apartment,
  type ApartmentId,
  type PayMethod,
  type Service,
} from "@/lib/data";
import { SITE } from "@site";

// Orders and the trip draft live in browser storage until Supabase is wired up.
const KEYS = {
  orders: "selah.orders",
  trip: "selah.trip",
  currency: "selah.currency",
} as const;

export type OrderStatus = "pending" | "confirmed" | "declined" | "cancelled";

export type Order = {
  ref: string;
  status: OrderStatus;
  method: PayMethod;
  apartment: string;
  apartmentId: ApartmentId;
  checkIn: string | null;
  checkOut: string | null;
  nights: number;
  guests: number;
  name: string;
  email: string;
  phone: string;
  amount: number;
  amountLabel: string;
  extras: string[];
  at: number;
};

type TripDraft = {
  apartmentId: ApartmentId;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  cart: string[];
};

type GuestForm = { name: string; email: string; note: string };

type BookingContextValue = TripDraft & {
  hydrated: boolean;
  apartment: Apartment;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  money: (n: number) => string;
  setApartment: (id: ApartmentId) => void;
  pickDay: (iso: string) => void;
  clearDates: () => void;
  incGuests: () => void;
  decGuests: () => void;
  cartItems: Service[];
  toggleCartItem: (title: string) => void;
  totals: Totals;
  extrasTotal: number;
  grandTotal: number;
  split: boolean;
  setSplit: (v: boolean) => void;
  amountDue: number;
  payMethod: PayMethod;
  setPayMethod: (m: PayMethod) => void;
  form: GuestForm;
  updateForm: (patch: Partial<GuestForm>) => void;
  momoPhone: string;
  setMomoPhone: (v: string) => void;
  orders: Order[];
  lastOrder: Order | null;
  submitClaim: () => Order | null;
  settleOrder: (ref: string, status: "confirmed" | "declined") => void;
  cancelOrder: (ref: string) => void;
  whatsappLines: () => string[];
};

const BookingContext = createContext<BookingContextValue | null>(null);

function read<T>(store: Storage, key: string): T | null {
  try {
    const v = store.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

function write(store: Storage, key: string, val: unknown) {
  try {
    store.setItem(key, JSON.stringify(val));
  } catch {
    // Storage can be unavailable (private mode, quota) — state still works in memory.
  }
}

const initialTrip: TripDraft = {
  apartmentId: "apartment-1",
  checkIn: null,
  checkOut: null,
  guests: 2,
  cart: [],
};

export function BookingProvider({ children }: { children: ReactNode }) {
  const { toast } = useUI();
  const [hydrated, setHydrated] = useState(false);
  const [trip, setTrip] = useState<TripDraft>(initialTrip);
  const [currency, setCurrencyState] = useState<Currency>(SITE.pricing.currency);
  const [split, setSplit] = useState(false);
  const [payMethod, setPayMethod] = useState<PayMethod>("Mobile Money");
  const [form, setForm] = useState<GuestForm>({ name: "", email: "", note: "" });
  const [momoPhone, setMomoPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastRef, setLastRef] = useState<string | null>(null);

  // Hydrate from browser storage after mount so server and client render the same markup.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-off hydration from browser storage */
    const savedTrip = read<TripDraft>(window.sessionStorage, KEYS.trip);
    if (savedTrip) setTrip({ ...initialTrip, ...savedTrip, apartmentId: getApartment(savedTrip.apartmentId).id });
    const savedCur = read<Currency>(window.localStorage, KEYS.currency);
    if (savedCur === "USD" || savedCur === "UGX") setCurrencyState(savedCur);
    setOrders(read<Order[]>(window.localStorage, KEYS.orders) ?? []);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (hydrated) write(window.sessionStorage, KEYS.trip, trip);
  }, [trip, hydrated]);

  const saveOrders = useCallback((next: Order[]) => {
    setOrders(next);
    write(window.localStorage, KEYS.orders, next);
  }, []);

  const apartment = getApartment(trip.apartmentId);
  const money = useCallback((n: number) => formatMoney(n, currency), [currency]);
  const totals = useMemo(
    () => computeTotals(apartment, trip.checkIn, trip.checkOut),
    [apartment, trip.checkIn, trip.checkOut],
  );
  const cartItems = useMemo(
    () => trip.cart.map((t) => SERVICES.find((s) => s.title === t)).filter((s): s is Service => !!s),
    [trip.cart],
  );
  // Picked extras are a flat fee per stay, added on top of the nights.
  const extrasTotal = cartItems.reduce((sum, s) => sum + (s.amount ?? 0), 0);
  const grandTotal = totals.total + extrasTotal;
  const splitOn = CONFIG.enableSplitPay && split;
  const amountDue = splitOn ? Math.round(grandTotal / 2) : grandTotal;

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    write(window.localStorage, KEYS.currency, c);
  }, []);

  const setApartment = useCallback((id: ApartmentId) => setTrip((t) => ({ ...t, apartmentId: id })), []);

  const pickDay = useCallback(
    (iso: string) => {
      const { checkIn, checkOut } = trip;
      if (!checkIn || checkOut) {
        setTrip((t) => ({ ...t, checkIn: iso, checkOut: null }));
        return;
      }
      if (iso <= checkIn) {
        setTrip((t) => ({ ...t, checkIn: iso }));
        return;
      }
      setTrip((t) => ({ ...t, checkOut: iso }));
      const n = nightsBetween(checkIn, iso);
      toast("ok", "Dates held for 15 minutes", `${n} ${n === 1 ? "night" : "nights"} at ${apartment.name}.`);
    },
    [trip, apartment.name, toast],
  );

  const clearDates = useCallback(() => setTrip((t) => ({ ...t, checkIn: null, checkOut: null })), []);
  const incGuests = useCallback(() => setTrip((t) => ({ ...t, guests: Math.min(12, t.guests + 1) })), []);
  const decGuests = useCallback(() => setTrip((t) => ({ ...t, guests: Math.max(1, t.guests - 1) })), []);

  const toggleCartItem = useCallback(
    (title: string) => {
      const on = trip.cart.includes(title);
      setTrip((t) => ({ ...t, cart: on ? t.cart.filter((x) => x !== title) : [...t.cart, title] }));
      if (!on) {
        const s = SERVICES.find((x) => x.title === title);
        toast("ok", "Added to your trip", s ? `${title} · ${servicePrice(s, money)}` : title);
      }
    },
    [trip.cart, toast, money],
  );

  const updateForm = useCallback((patch: Partial<GuestForm>) => setForm((f) => ({ ...f, ...patch })), []);

  const submitClaim = useCallback((): Order | null => {
    if (!form.name.trim()) {
      toast("warn", "Add your name", "We match the payment to the name on the order.");
      return null;
    }
    if (payMethod === "Mobile Money" && momoPhone.replace(/[^0-9]/g, "").length < 9) {
      toast("warn", "Add your phone number", "Enter the number you sent the Mobile Money from.");
      return null;
    }
    const order: Order = {
      ref: bookingRef(),
      status: "pending",
      method: payMethod,
      apartment: apartment.name,
      apartmentId: apartment.id,
      checkIn: trip.checkIn,
      checkOut: trip.checkOut,
      nights: totals.n,
      guests: trip.guests,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: intlPhone(momoPhone),
      amount: Math.round(amountDue),
      amountLabel: money(amountDue),
      extras: trip.cart,
      at: Date.now(),
    };
    saveOrders([order, ...orders].slice(0, 20));
    setLastRef(order.ref);
    toast("ok", "Booking recorded as pending", `${SITE.host.firstName} verifies the payment, then confirms.`);
    return order;
  }, [form, payMethod, momoPhone, apartment, trip, totals.n, amountDue, money, orders, saveOrders, toast]);

  const settleOrder = useCallback(
    (ref: string, status: "confirmed" | "declined") => {
      const order = orders.find((o) => o.ref === ref);
      if (!order) return;
      saveOrders(orders.map((o) => (o.ref === ref ? { ...o, status } : o)));
      // TODO: send a real SMS/email (Africa's Talking or Twilio) instead of simulating it.
      toast(
        status === "confirmed" ? "ok" : "warn",
        status === "confirmed" ? "Order confirmed" : "Order declined",
        status === "confirmed"
          ? `Booking ${ref} is confirmed.`
          : `We couldn't find payment for ${ref}.`,
      );
    },
    [orders, saveOrders, toast],
  );

  const cancelOrder = useCallback(
    (ref: string) => {
      saveOrders(orders.map((o) => (o.ref === ref ? { ...o, status: "cancelled" as const } : o)));
      toast("warn", "Cancellation requested", `${SITE.host.firstName} will confirm any refund in line with the cancellation policy.`);
    },
    [orders, saveOrders, toast],
  );

  const whatsappLines = useCallback(
    () =>
      [
        `Hello ${SITE.name} — I'd like to book ${apartment.name}.`,
        `Dates: ${fmtDate(trip.checkIn, true) || "TBD"} → ${fmtDate(trip.checkOut, true) || "TBD"} (${totals.n} ${totals.n === 1 ? "night" : "nights"})`,
        `Guests: ${trip.guests}`,
        `Total: ${money(grandTotal)}`,
        cartItems.length ? `Extras: ${cartItems.map((e) => e.title).join(", ")}` : "",
        form.name ? `Name: ${form.name}` : "",
      ].filter(Boolean),
    [apartment.name, trip, totals.n, money, grandTotal, cartItems, form.name],
  );

  const lastOrder = orders.find((o) => o.ref === lastRef) ?? null;

  const value: BookingContextValue = {
    ...trip,
    hydrated,
    apartment,
    currency,
    setCurrency,
    money,
    setApartment,
    pickDay,
    clearDates,
    incGuests,
    decGuests,
    cartItems,
    toggleCartItem,
    totals,
    extrasTotal,
    grandTotal,
    split,
    setSplit,
    amountDue,
    payMethod,
    setPayMethod,
    form,
    updateForm,
    momoPhone,
    setMomoPhone,
    orders,
    lastOrder,
    submitClaim,
    settleOrder,
    cancelOrder,
    whatsappLines,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within a BookingProvider");
  return ctx;
}

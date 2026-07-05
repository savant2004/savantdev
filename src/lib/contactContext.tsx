import { createContext, useContext, useState, type ReactNode } from 'react';

interface ContactContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const ContactContext = createContext<ContactContextValue>({
  open: false,
  setOpen: () => {},
});

export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <ContactContext.Provider value={{ open, setOpen }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContactModal() {
  return useContext(ContactContext);
}

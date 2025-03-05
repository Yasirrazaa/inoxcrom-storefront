import { createContext, useContext } from "react";

export const CountryCodeContext = createContext<string | undefined>(undefined);

export function useCountryCode() {
const context = useContext(CountryCodeContext);
if (context === undefined) {
throw new Error("useCountryCode must be used within a CountryCodeProvider");
}
return context;
}

export function CountryCodeProvider({
children,
countryCode,
}: {
children: React.ReactNode;
countryCode: string;
}) {
return (
<CountryCodeContext.Provider value={countryCode}>
{children}
</CountryCodeContext.Provider>
);
}
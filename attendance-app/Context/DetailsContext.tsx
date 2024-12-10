import { createContext, ReactNode, Dispatch, SetStateAction, useState } from "react";

interface DetailsContextType {
    detailsFlag: boolean,
    setDetailsFlag: Dispatch<SetStateAction<boolean>>
}

const DetailsContext = createContext<DetailsContextType | undefined>(undefined);

const DetailsProvider = ({children}: {children: ReactNode}) => {
    const [detailsFlag, setDetailsFlag] = useState(false);

    return (
        <DetailsContext.Provider value={{ detailsFlag, setDetailsFlag }}>
            {children}
        </DetailsContext.Provider>
    )
};

export {DetailsContext, DetailsProvider}
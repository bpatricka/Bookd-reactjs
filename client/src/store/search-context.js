import { createContext, useEffect, useState } from "react";
import { callMsGraph } from "../graph";


const SearchContext = createContext({
    search: null,
    getSearch: (text) => {},
    clearSearch: () => {}
});

export function SearchContextProvider(props) {
    const [userSearch, setUserSearch] = useState('');

    function getSearchHandler(search){
        setUserSearch(search);
    }

    function clearSearchHandler(){
        if (userSearch) {
            setUserSearch(null);
        }
    }

    const context = {
        search: userSearch,
        getSearch: getSearchHandler,
        clearSearch: clearSearchHandler
    };

    return (
        <SearchContext.Provider value={context}>
            {props.children}
        </SearchContext.Provider>
    )

}

export default SearchContext;
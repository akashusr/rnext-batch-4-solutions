import React from "react";
import Container from "./components/Container";
import Footer from "./components/Footer";
import Form from "./components/Form";
import Header from "./components/Header";
import Main from "./components/Main";
import PasswordCardsGrid from "./components/PasswordCardsGrid";
import SearchSortFilter from "./components/SearchSortFilter";

export default function App() {
    const [vaults, setVaults] = React.useState([]);
    const [mutateVaults, setMutateVaults] = React.useState(null);
    const [search, setSearch] = React.useState("");

    return (
        <>
            <Header />
            <Form setVaults={setVaults} />
            <Main>
                <Container className={"space-y-10 px-4"}>
                    <SearchSortFilter
                        vaults={vaults}
                        search={search}
                        setSearch={setSearch}
                        mutateVaults={mutateVaults}
                        setMutateVaults={setMutateVaults}
                    />
                    <PasswordCardsGrid
                        vaults={mutateVaults || vaults}
                        search={search}
                    />
                </Container>
            </Main>
            <Footer />
        </>
    );
}

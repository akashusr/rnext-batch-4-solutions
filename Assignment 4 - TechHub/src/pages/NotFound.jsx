import Container from "../components/Container";

export default function NotFoundPage() {
    return (
        <Container
            className={
                "notfound py-10! space-y-8 flex-1 h-screen flex justify-center items-center"
            }
        >
            <h1 className="text-center text-3xl">404 - Page Not Found</h1>
        </Container>
    );
}

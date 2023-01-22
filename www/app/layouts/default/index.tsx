import Footer from "cky/components/footer/index.tsx";
import Header from "cky/components/header/index.tsx";
import Main from "cky/components/main/index.tsx";
import type { LayoutProps } from "./types.ts";

const DefaultLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  );
};

export default DefaultLayout;

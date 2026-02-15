import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTopButton from './ScrollToTopButton';

export default function Layout({ children, title = 'TANV', variant = 'dark', hideFooter = false }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Navbar variant={variant} />
      <main className="pt-16">{children}</main>
      {!hideFooter && <Footer />}
      <ScrollToTopButton />
    </>
  );
}

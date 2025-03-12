import Hero from "@modules/home/components/hero"
import Catalogue from "@modules/home/components/catalogue"
import RefillInfo from "@modules/home/components/refill-info"
import FeaturedProducts from "@modules/home/components/featured-products"

export default function Home() {
  return (
    <>
      <Hero />
      <Catalogue />
      <FeaturedProducts />
      <RefillInfo />
    </>
  )
}

import Features from '@/components/Features'
import Footer from '@/components/Footer'
import Reviews from '@/components/Reviews'
import Hero from '@/components/Hero'
import Product from './Product'
import React from 'react'

const Home = () => {
  return (
    <div>
      <Hero/>
      <Product />
      <Features/>
      <Reviews />
      <Footer/>
    </div>
  )
}

export default Home

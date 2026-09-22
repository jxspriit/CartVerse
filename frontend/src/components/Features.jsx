import {
  CreditCard,
  Headphones,
  RefreshCcw,
  ShieldCheck,
  Tag,
  Truck,
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Get your orders delivered quickly and safely right to your doorstep.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    description:
      "Your personal information and payments are protected with secure technology.",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description:
      "Enjoy safe and convenient payment options for every purchase.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our support team is always ready to help you with your questions.",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description:
      "Return eligible products easily and enjoy a hassle-free shopping experience.",
  },
  {
    icon: Tag,
    title: "Best Deals",
    description:
      "Discover amazing offers and great prices across our product categories.",
  },
];

const Features = () => {
  return (
    <section className="bg-pink-50 px-4 py-14 sm:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-pink-600">
            CartVerse Benefits
          </p>

          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Why Shop With Us?
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-600 sm:text-base">
            We make online shopping simple, secure, and convenient—everything
            you need for a better shopping experience.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group rounded-2xl border border-pink-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={24} strokeWidth={2} />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>

                <p className="text-sm leading-6 text-gray-600">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
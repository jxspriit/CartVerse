import React from "react";
import {
  Star,
  CheckCircle,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "John Doe",
    rating: 5,
    date: "2 days ago",
    verified: true,
    comment:
      "Absolutely amazing product. Quality exceeded my expectations and delivery was very fast.",
  },
  {
    id: 2,
    name: "Emily Watson",
    rating: 4,
    date: "1 week ago",
    verified: true,
    comment:
      "Very good product. Packaging was nice and customer support was helpful.",
  },
  {
    id: 3,
    name: "Michael Smith",
    rating: 5,
    date: "3 weeks ago",
    verified: false,
    comment:
      "Worth every penny. Highly recommended!",
  },
];

const ratingData = [
  { star: 5, percent: 80 },
  { star: 4, percent: 12 },
  { star: 3, percent: 5 },
  { star: 2, percent: 2 },
  { star: 1, percent: 1 },
];

const Reviews = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">

      <h2 className="text-3xl font-bold mb-10">
        Customer Reviews
      </h2>

      <div className="grid lg:grid-cols-3 gap-10">

        {/* Rating Summary */}

        <div className="bg-white shadow rounded-xl p-6 border">

          <div className="flex items-center gap-3">

            <h1 className="text-5xl font-bold">4.8</h1>

            <div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill="currentColor"
                  />
                ))}
              </div>

              <p className="text-gray-500 text-sm mt-1">
                Based on 245 Reviews
              </p>
            </div>

          </div>

          <div className="mt-8 space-y-4">

            {ratingData.map((item) => (

              <div
                key={item.star}
                className="flex items-center gap-3"
              >

                <span className="w-5 text-sm">
                  {item.star}
                </span>

                <Star
                  size={14}
                  className="text-yellow-400 fill-yellow-400"
                />

                <div className="flex-1 h-2 bg-gray-200 rounded-full">

                  <div
                    style={{
                      width: `${item.percent}%`,
                    }}
                    className="bg-yellow-400 h-2 rounded-full"
                  ></div>

                </div>

                <span className="text-sm text-gray-500">
                  {item.percent}%
                </span>

              </div>

            ))}

          </div>

        </div>

        {/* Reviews */}

        <div className="lg:col-span-2 space-y-6">

          {reviews.map((review) => (

            <div
              key={review.id}
              className="bg-white border rounded-xl shadow-sm p-6"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h3 className="font-semibold text-lg">
                    {review.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-1">

                    <div className="flex text-yellow-400">

                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill="currentColor"
                        />
                      ))}

                    </div>

                    <span className="text-gray-500 text-sm">
                      {review.date}
                    </span>

                  </div>

                </div>

                {review.verified && (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium">

                    <CheckCircle size={16} />

                    Verified Purchase

                  </span>
                )}

              </div>

              <p className="text-gray-600 mt-4 leading-7">
                {review.comment}
              </p>

              <div className="flex gap-6 mt-5">

                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition">

                  <ThumbsUp size={18} />

                  Helpful

                </button>

                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition">

                  <MessageCircle size={18} />

                  Reply

                </button>

              </div>

            </div>

          ))}

          <button className="w-full py-3 border rounded-lg hover:bg-gray-100 font-medium transition">
            Load More Reviews
          </button>

        </div>

      </div>

    </section>
  );
};

export default Reviews;
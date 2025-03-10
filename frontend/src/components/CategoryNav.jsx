import { Link } from 'react-router-dom';

const categories = [
  {
    name: "MEN",
    slug: "mens",
    image:
      "https://img.freepik.com/premium-photo/best-friend-holding-hand-shoot-from_8595-10732.jpg?uid=R114821896&ga=GA1.1.1103696323.1736837892&semt=ais_hybrid",
  },
  {
    name: "WOMEN",
    slug: "womens",
    image:
      "https://img.freepik.com/free-psd/portrait-young-girl-with-face-mask_23-2150164074.jpg?uid=R114821896&ga=GA1.1.1103696323.1736837892&semt=ais_hybrid",
  },
];

function CategoryNav() {
  return (
    <div className="w-full overflow-hidden py-8 md:py-16">
      <div className="container mx-auto px-2">
        <div className="flex flex-col gap-5">
          {categories.map((cat, index) => (
            <Link
              key={cat.slug}
              to={`/products?main=${cat.slug === "mens" ? "a782ade0-7310-4152-914f-ddfee663d8ad" : "c0277e3f-6324-4c41-bb8a-6fbbf9eee579"}`}
              className="block group"
            >
              <div
                className={`
                  flex flex-row items-center justify-center
                  ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}
                  rounded-lg hover:shadow-lg transition-shadow
                  relative overflow-hidden
                `}
              >
                <h2
                  className={`text-5xl max-sm:relative ${
                    index % 2 === 0 ? "-right-11" : "right-[3.3rem]"
                  } md:text-[8rem] font-black text-gray-800 group-hover:text-sky-600 mb-4 md:mb-0 transition-colors`}
                >
                  {cat.name}
                </h2>
                <img
                  src={cat.image || "/placeholder.svg"}
                  alt={cat.name}
                  className={`w-full md:w-1/2 h-52 md:h-auto object-cover rounded-lg ${
                    index % 2 === 0 ? "p-6" : "p-6"
                  }`}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryNav; 
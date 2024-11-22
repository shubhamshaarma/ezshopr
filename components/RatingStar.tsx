import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const RatingStar = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating); // Number of full stars
    const hasHalfStar = rating % 1 >= 0.5; // Check if there's a half star
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars

    return (
        <>
            {/* Render full stars */}
            {Array(fullStars)
                .fill(0)
                .map((_, index) => (
                    <FaStar
                        key={`full-${index}`}
                        className="text-sm text-red-400"
                    />
                ))}

            {/* Render half star */}
            {hasHalfStar && <FaStarHalfAlt className="text-sm text-red-400" />}

            {/* Render empty stars */}
            {Array(emptyStars)
                .fill(0)
                .map((_, index) => (
                    <FaRegStar
                        key={`empty-${index}`}
                        className="text-sm text-red-400"
                    />
                ))}
        </>
    );
};

export default RatingStar;

import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingItem = ({ listing }) => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-[320px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0]}
          alt="listingcover"
          className="h-[320px] w-[320px] sm:h-[220px] object-cover hover:scale-105 hover:rotate-[-1deg] transition-scale duration-500 "
        />
        <div className="p-3 mt-4 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold flex items-center">
            ₹
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " /month"}
          </p>
          <div className="text-slate-700 flex gap-4 font-semibold">
            <div className="flex">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>
            <div className="flex">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} bathrooms `
                : `${listing.bathrooms} bathroom `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

ListingItem.propTypes = {
  listing: PropTypes.object,
};

export default ListingItem;

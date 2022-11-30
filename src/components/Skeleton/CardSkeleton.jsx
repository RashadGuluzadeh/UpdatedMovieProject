import React from "react";

import Skeleton from "react-loading-skeleton";

export const CardSkeleton = ({ cards }) => {
  return Array(cards)
    .fill(0)
    .map((item, i) => (
      <div key={i}>
        <div className=" relative flex flex-col justify-center item-center text-center p-4 bg-[#151312] shadow-lg backdrop-4">
          <Skeleton width={320} height={432} />
          <div className="inline w-80 text-center">
            <h3 className="text-white text-xl mt-4 h-16">
              <Skeleton />
            </h3>
            <p className="text-white text-xl">
              <Skeleton width={144} />
            </p>
          </div>
        </div>
      </div>
    ));
};

import React from "react";

import Skeleton from "react-loading-skeleton";

export const SlideshowSkeleton = () => {
  return (
    <div>
      {" "}
      <div
        className="mt-16 bg-[#151312]  !flex gap-24 justify-center p-8 pb-16 max-w-7xl mx-auto mb-4"
      >
        <Skeleton width={266} height={440}/>
        <div className="text-white mt-10 max-w-xl !flex !flex-col">
          <div className="flex justify-between">
            <h1 className="!text-4xl"><Skeleton width={150}/></h1>
            <div className="flex gap-5 text-amber-400">
              <p className="flex text-4xl text-white"><Skeleton width={100}/></p>
            </div>
          </div>
          <div className="flex gap-2 text-lightgrey text-xl mt-5 items-center text-center">
            <p className="flex gap-4 items-center">
              {" "}
                <Skeleton width={120} />
            </p>{" "}
            <p className="flex  items-center gap-4">
              {" "}
              <Skeleton width={120} />
            </p>{" "}
            <p className="flex gap-4 items-center">
              {" "}
              <Skeleton width={120} />
            </p>
          </div>

          <div className="mt-8 flex gap-2 flex-col">
            <p className="!inline border-solid text-2xl ">
              <Skeleton  width={150}/>
            </p>
        <p className="mt-5 text-xl w-90 mb-3"><Skeleton count={6} width={500}/></p>
          </div>
        </div>
      </div>
    </div>
  );
};

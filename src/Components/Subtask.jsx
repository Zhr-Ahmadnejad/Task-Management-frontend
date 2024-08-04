import React from "react";

function Subtask({ data_sub, change }) {

  return (
    <div className="w-full flex hover:bg-[#5fc76240] dark:hover:bg-[#5fc76240] rounded-md relative items-center justify-start text-black dark:text-white dark:bg-[#20212c] p-3 gap-4 bg-[#f4f7fd]">
      <input
        className="w-4 h-4 accent-[#416555] cursor-pointer"
        type="checkbox"
        checked={!data_sub.active} 
        onChange={(e) => change(e, data_sub.id)} 
      />
      <p className={data_sub.active ? "" : "line-through opacity-30"}>
        {data_sub.title} 
      </p>
    </div>
  );
}

export default Subtask;


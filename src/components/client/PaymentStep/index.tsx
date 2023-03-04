import React, { useState, useEffect } from "react";
import CountdownComp from "../Countdown";

type Props = {
   nextStep: any, children: any, rightContent: any, name: any
};
const PaymentStep = ({ nextStep, children, rightContent, name }: Props) => {
   let deadline = Date.now() + 1000 * 60 * 9;

   const getTimeCountdown = (val: any) => {
      
   }


   const renderCD = () => {
      return (
         <></>
      )
   }
   return (
      <>
         <div className="flex flex-row justify-center mt-16 ">
            <div className="w-[55%]">
               <div className="bg-[#f6710d] h-[680px] ">
                  <div className="flex items-center justify-between p-2">
                     <h1 className="text-3xl p-3 text-white ">
                        {name}
                     </h1>
                     <div className="">
                        <CountdownComp deadline={deadline} onChange={getTimeCountdown} />
                     </div>
                  </div>
                  {children}

               </div>
            </div>
            <div className="w-[20%] bg-white ml-10 h-[680px] ">
               {rightContent}
            </div>
         </div>

      </>

   );
};

export default PaymentStep;

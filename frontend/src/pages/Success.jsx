export default function Success() {
  return (
    <div id="rubik500" className=" h-screen w-screen flex flex-col text-center  justify-center overflow-hidden relative">
      <h1 className="text-3xl font-bold text-green-700 min-[1050px]:scale-150">✅ Payment Successful!</h1>
      <p className="mt-4 text-white min-[1050px]:scale-120">Your order has been placed. Thank you!</p>

      <a href="/dashboard" className="text-white text-[25px] absolute bottom-[20%] w-full justify-center hover:scale-115 duration-200">CONTINUE SHOPPING</a>
    </div>
  );
}

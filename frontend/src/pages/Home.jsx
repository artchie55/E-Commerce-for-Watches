import { useState, useEffect, useRef } from 'react';
import watchPic from '../images/watchhomepage.jpg';
import useSmoothScroll from "./hook/useSmoothScroll";


const watches = [
  'https://gshock.casio.com/content/dam/casio/product-info/locales/us/en/timepiece/product/watch/G/GM/GMA/gma-s120sg-7a/assets/GMA-S120SG-7A.png.transform/product-panel/image.png',
  'https://www.nixon.com/cdn/shop/files/A045-001-view1.png?v=1718723920',
  'https://www.hublot.com/sites/default/files/2020-04/441.JX_.4802.RT_.png',
  'https://clipart-library.com/image_gallery2/Watch-PNG-Image.png',
  'https://www.transparentpng.com/download/watch/yBzv8m-classic-watch-hd-images-.png',
  'https://pngimg.com/uploads/watches/watches_PNG9852.png'
];

export default function WatchCarousel() {
  const visibleCount = 3;
  const total = watches.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const trackRef = useRef(null);
  const imageRef = useRef(null);

  const extendedItems = [
    ...watches.slice(-visibleCount),
    ...watches,
    ...watches.slice(0, visibleCount)
  ];

  const startIndex = visibleCount;

  useEffect(() => {
    setCurrentIndex(startIndex);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        slideTo(currentIndex + 1);
      }
    }, 1000); // 1 second

    return () => clearInterval(interval);
  }, [currentIndex, isAnimating]);

  const slideTo = (index) => {
    setIsAnimating(true);
    setCurrentIndex(index);
  };

  const next = () => {
    if (isAnimating) return;
    slideTo(currentIndex + 1);
  };

  const prev = () => {
    if (isAnimating) return;
    slideTo(currentIndex - 1);
  };

  const handleTransitionEnd = () => {
    setIsAnimating(false);
    if (currentIndex === extendedItems.length - visibleCount) {
      setCurrentIndex(startIndex);
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform = `translateX(-${startIndex * (100 / extendedItems.length)}%)`;
      void trackRef.current.offsetWidth;
      trackRef.current.style.transition = 'transform 0.5s ease';
    }

    if (currentIndex === 0) {
      setCurrentIndex(total);
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform = `translateX(-${total * (100 / extendedItems.length)}%)`;
      void trackRef.current.offsetWidth;
      trackRef.current.style.transition = 'transform 0.5s ease';
    }
  };



   const handleMouseMove = (e) => {
    const img = imageRef.current;
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100;

    img.style.transform = `scale(1.25) translate(${x}px, ${y}px)`;
  };

  const resetTransform = () => {
    const img = imageRef.current;
    img.style.transform = 'scale(1) translate(0, 0)';
  };

    useSmoothScroll();

  return (
    <>
    <div id='lora400' className=' bg-black flex  justify-between max-[1050px]:justify-center '>
      <div className='text-white min-[1050px]:ml-[20px] pointer-events-none flex flex-col max-[1050px]:items-center max-[1050px]:scale-75'>
        <div className='text-[80px]'>WATCHES</div>
        <div className='text-[25px]'>• THE INTRODUCTION</div>
      </div>
      <a id='big-screen' href='/login' className='text-white block text-[40px] mt-[40px] mr-[70px] cursor-pointer hover:brightness-80 hover:scale-110  duration-200'>LOGIN</a>
    </div>
    
      <div className="w-full bg-black text-white flex flex-col items-center overflow-hidden py-[250px] max-[950px]:pb-[310px]">
        <div className="relative w-full max-w-[53vw] max-[950px]:max-w-[1000px] h-[250px] max-[950px]:h-[150px] flex items-center justify-center scale-300 min-[950px]:scale-200">
          <button
            onClick={prev}
            className="absolute left-[3.472vw] text-[100px] z-20 hover:text-gray-500 transition select-none cursor-pointer hover:scale-120 duration-200"
          >
            ‹
          </button>

          <div className="overflow-hidden w-full">
            <div
              ref={trackRef}
              onTransitionEnd={handleTransitionEnd}
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                width: `${(extendedItems.length / visibleCount) * 100}%`,
                transform: `translateX(-${currentIndex * (100 / extendedItems.length)}%)`
              }}
            >
              {extendedItems.map((img, idx) => (
                <div
                  key={idx}
                  className="w-1/3 flex justify-center items-center px-4"
                >
                  <img
                    src={img}
                    alt={`watch-${idx}`}
                    className="w-[150px] sm:w-[220px] max-h-[200px] object-contain transition duration-500"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={next}
            className="absolute right-[3.472vw] text-[100px] z-20 hover:text-gray-500 transition select-none cursor-pointer hover:scale-120 duration-200"
          >
            ›
          </button>

          <a href='/dashboard' id='lora400' className='absolute min-[950px]:hidden bottom-[-25%] max-[950px]:bottom-[-50%] flex flex-col items-center text-white leading-[40px] cursor-pointer min-[950px]:hover:scale-110 hover:brightness-75 duration-200 max-[950px]:scale-45'>
            <div className='text-[30px]'>BROWSE</div>
            <div className='text-[40px]'>COLLECTION</div>
          </a>
        </div>
          <a href='/dashboard' id='lora400' className='absolute max-[950px]:hidden bottom-[5%] max-[950px]:bottom-[-50%] flex flex-col items-center text-white leading-[100px] cursor-pointer min-[950px]:hover:scale-110 hover:brightness-75 duration-200 max-[950px]:scale-45'>
            <div className='text-[70px]'>BROWSE</div>
            <div className='text-[100px]'>COLLECTION</div>
          </a>
      
        
      </div>


      <div id='lora400' className='text-white bg-black flex flex-col items-center  pt-[350px] pb-[350px] max-[950px]:pt-[70px] max-[950px]:pb-[10px]'>
           <div className='max-[950px]:scale-75 '>
            <div className='text-[80px] max-[950px]:text-[60px] text-center max-[950px]:leading-[70px]'>WHERE TIME MEETS ELEGANCE</div>
         <div className='flex flex-col items-center leading-[60px] max-[950px]:leading-[45px] text-center mt-[20px] text-[25px] max-[950px]:text-[21px] '>
            <div className=' mt-[40px]'>Welcome to WATCHES, the home of refined timekeeping.</div>
            <div className=''>Each watch in our collection is a masterpiece — a fusion of precision engineering, timeless design, and uncompromising luxury.</div>
            <div className='max-[950px]:hidden'>Crafted for those who value the finer things, our timepieces are more than accessories — they’re statements. Statements of success, taste, and legacy.</div>
            <div className=''>Designed to command presence, our timepieces blend heritage craftsmanship with modern sophistication.</div>
            <div className=''>More than a watch — it's a legacy you wear, a symbol of distinction that stands the test of time.</div>
         </div> 
            <div className='text-[50px] mt-[60px] text-center'>DISCOVER THE ART OF TIME</div>   
          </div>     
      </div>     
          


        <div
           className="w-full h-[800px] max-[950px]:hidden bg-black/80 overflow-hidden"
           onMouseMove={handleMouseMove}
           onMouseLeave={resetTransform}
            >
                <img
                  ref={imageRef}
                  src={watchPic}
                  alt="Watch Login"
                  className="w-full h-full object-cover object-center transition-transform duration-300 ease-out pointer-events-none select-none"
                  draggable="false"
                  onContextMenu={(e) => e.preventDefault()}
                  onMouseDown={(e) => e.preventDefault()}
                />
         </div>
 

         <img src={watchPic}  className='min-[950px]:hidden w-full object-cover h-[700px]'/>


       <div id='lora400' className='text-white flex flex-col items-center bg-black pt-[350px] max-[950px]:pt-[100px] pb-[250px] max-[950px]:pb-[0px]'>
          <div className='text-[85px] text-center max-[950px]:text-[50px] max-[950px]:leading-[50px]'>INSIDE THE MOVEMENT</div>
           <div className='leading-[60px] max-[950px]:leading-[40px] text-[25px] max-[950px]:text-[21px] text-center max-[950px]:scale-80 max-[950px]:max-w-[900px]'>
            <div className='mt-[80px] max-[950px]:mt-[0px]'>At the heart of every timepiece lies a meticulously engineered movement — the silent engine</div>
            <div>that powers not just the hands of the watch, but the very soul of our craftsmanship. We partner with world-renowned</div>
            <div>manufacturers to source only the most trusted and time-tested mechanisms, ensuring that every tick echoes with precision and purpose.</div>
            <div>Whether it's the smooth, self-winding rhythm of a Swiss automatic movement, revered for its longevity and artistry, or the unwavering</div>
            <div>accuracy of a refined quartz engine, chosen for its modern reliability, each watch is calibrated to perfection</div>
            <div>by skilled horologists. Every component — from the balance wheel to the escapement — is carefully assembled,</div>
            <div>inspected, and tested to meet rigorous performance standards.</div>
          </div>     
      </div>       

    </>
  );
}

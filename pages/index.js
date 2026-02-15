import { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';

const typewriterLines = [
  'bash-3.2$ who am i',
  'KIITIAN PLAYER',
  'bash-3.2$ ls',
  'Events Workshops Hackathons Cultural Proshows Gaming FoodArena TreasureHunt',
  'bash-3.2$ uname -a',
  'KIITFest arcadeOS 9.0 #Pixel SMP PREEMPT_DYNAMIC x86_64 KIIT University',
];

const rotatingTexts = [
  'New quest unlocked',
  'Achievement unlocked',
  'Boss approaching…',
  'Multiplayer joined',
  'Energy +100',
  'XP Gained',
  'Level Up!',
  'Respawning at KIIT Campus',
];

export default function HomePage() {
  const imageRef = useRef(null);
  const festRef = useRef(null);
  const astronautRef = useRef(null);
  const leftImageRef = useRef(null);
  const rightImageRef = useRef(null);
  const leftCenterRef = useRef(null);
  const bottomRightRef = useRef(null);
  const terminalRef = useRef(null);
  const [tickerIndex, setTickerIndex] = useState(0);
  const festTransform = useRef({ scrollY: 0, mx: 0, my: 0 });

  const applyFestTransform = () => {
    if (!festRef.current) return;
    const { scrollY, mx, my } = festTransform.current;
    festRef.current.style.transform = `translate3d(${mx}px, ${scrollY + my}px, 0)`;
  };

  useEffect(() => {
    let currentIndex = 0;
    let charIndex = 0;
    let timeoutId;
    const target = terminalRef.current;
    if (!target) return undefined;

    const typeWriter = () => {
      if (!target) return;
      if (currentIndex >= typewriterLines.length) {
        timeoutId = setTimeout(() => {
          currentIndex = 0;
          target.innerHTML = '';
          typeWriter();
        }, 3000);
        return;
      }

      const line = typewriterLines[currentIndex];
      if (charIndex < line.length) {
        target.innerHTML += line.charAt(charIndex);
        charIndex += 1;
      } else {
        target.innerHTML += '<br />';
        currentIndex += 1;
        charIndex = 0;
      }
      timeoutId = setTimeout(typeWriter, 75);
    };

    typeWriter();
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const onMouseMove = (event) => {
      if (!imageRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth - 0.5) * 2;
      const y = (event.clientY / innerHeight - 0.5) * 2;
      const force = 20;
      const rx = y * force;
      const ry = -x * force;
      imageRef.current.style.transform = `rotateY(${ry}deg) rotateX(${rx}deg)`;

      // subtle parallax drift for fest graphic
      festTransform.current.mx = x * 10;
      festTransform.current.my = y * 6;
      applyFestTransform();
    };
    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      festTransform.current.scrollY = scrollY * 0.6;
      applyFestTransform();
      if (astronautRef.current) astronautRef.current.style.transform = `translateY(${scrollY * 0.6}px)`;
      if (leftImageRef.current) leftImageRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
      if (rightImageRef.current) rightImageRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
      if (leftCenterRef.current) leftCenterRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
      if (bottomRightRef.current) bottomRightRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/skills.nes/hehe.js';
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
  <Layout title="KIITFEST 9.0" variant="dark">
      <div className="home-shell">
        <div className="section text-white min-h-screen flex flex-col items-center justify-center z-20 home-section">
          <div ref={imageRef} className="img hero-image h-4/12 w-10/12 md:w-8/12 lg:w-5/12 top-20 z-10 img-tilt" id="image" />
          <div className="mt-3 text-xs md:text-sm text-yellow-300 headingfont">{rotatingTexts[tickerIndex]}</div>
          <div className="flex flex-col items-center justify-center my-4 gap-1">
            <img
              ref={festRef}
              src="/indexbg/9.0_fest.png"
              alt="KIIT Fest 9.0"
              className="img fest-hero-img w-11/12 min-[430px]:w-4/5 sm:w-7/12 md:w-6/12 xl:w-5/12 z-40"
            />
            <img
              ref={astronautRef}
              id="kiitmanImage"
              src="/indexbg/kiitman.png"
              alt="Astronaut"
              className="img astronaut w-3/6 min-[430px]:w-5/12 sm:w-4/12 md:w-3/12 xl:w-2/12 z-50"
            />
          </div>
        </div>

        <div className="section text-white z-10 home-section">
          <img
            ref={leftImageRef}
            src="/indexbg/smallplanetleft.png"
            alt="Left"
            className="img left-image w-[25%] min-[425px]:w-[20%] md:w-[15%] top-[20%]"
          />
          <img
            ref={rightImageRef}
            src="/indexbg/smallplanetright.png"
            alt="Right"
            className="img right-image w-[30%] min-[425px]:w-[20%] md:w-[15%] z-50 top-[90%]"
          />

          <div className="flex flex-col items-center justify-center min-h-screen w-full md:w-3/4 lg:h-full mt-14 lg:mt-5 z-30">
            <div className="bg-gray-900 bg-opacity-50 py-3 w-full flex flex-col">
              <div className="message flex items-center justify-start">
                <img src="/indexbg/pixelboyhead.png" className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 ml-3 mt-2" alt="left avatar" />
                <div className="bubble w-fit left shadow px-3 py-2 text-[10px] md:text-[14px] lg:text-[20px]">Welcome to KIIT Fest</div>
              </div>
              <div className="message flex items-center justify-end">
                <div className="bubble w-fit right shadow px-3 py-2 text-[10px] md:text-[14px] lg:text-[20px]">Ready to join the quest?</div>
                <img src="/indexbg/boyheadright.png" className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 mr-3 mt-2" alt="right avatar" />
              </div>
              <div className="message flex items-center justify-start">
                <img src="/indexbg/pixelboyhead.png" className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 ml-3 mt-2" alt="left avatar" />
                <div className="bubble w-fit left shadow px-3 py-2 text-[10px] md:text-[14px] lg:text-[20px]">I&apos;m a KIITian on board</div>
              </div>
              <div className="message flex items-center justify-start">
                <img src="/indexbg/pixelboyhead.png" className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 ml-3 mt-2" alt="left avatar" />
                <p className="bubble w-fit left shadow px-3 py-2 text-[10px] md:text-[14px] lg:text-[20px]">
                  Systems ready. Let&apos;s build.
                </p>
              </div>
              <div className="message flex items-center justify-end">
                <div className="bubble w-fit right shadow px-3 py-2 text-[10px] md:text-[14px] lg:text-[20px]">Copy that. Initiating.</div>
                <img src="/indexbg/boyheadright.png" className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 mr-3 mt-2" alt="right avatar" />
              </div>
              <div className="message flex items-center justify-start">
                <img src="/indexbg/pixelboyhead.png" className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 ml-3 mt-2" alt="left avatar" />
                <a href="#contact" className="bubble w-fit left shadow px-3 py-2 text-[10px] md:text-[14px] lg:text-[20px]">Press start to craft something unique</a>
              </div>
            </div>
          </div>
        </div>

        <div className="section text-white home-section">
          <img
            ref={leftCenterRef}
            src="/indexbg/bigplanetwithsmallplanet.png"
            alt="Left Center"
            className="img left-center-image w-1/2 min-[425px]:w-[30%] md:w-[25%] xl:w-[20%] top-[20%]"
          />
          <div className="flex flex-col md:flex-row min-h-screen">
            <div className="flex-1 flex items-center justify-center md:min-h-screen">
              <div className="w-11/12 m-5 md:my-10 p-4 md:p-6 border-4 border-[#3CFFF3] bg-[#171717] text-white shadow-[0_0_24px_rgba(60,255,243,0.35)]">
                <a
                  href="#events"
                  className="block p-2 text-[11px] md:text-[16px] lg:text-[23px] font-semibold text-[#FFEF12] bg-[#FF3300] border-b-4 border-[#FFEF12] hover:bg-[#FF2E88] hover:text-[#171717]"
                >
                  About KIIT Fest !
                </a>
                <p className="text-[11px] md:text-[14px] lg:text-[18px] text-start p-1 md:p-2 my-5 headingfont leading-relaxed text-[#FFEF12]">
                  Hello! Welcome to KIIT Fest 9.0 — an 8-Bit Retro Arcade Universe where campus life turns into a game. Inspired by classics like Pac-Man, Tetris, Contra and the movie PIXELS, KIIT Fest blends technology, culture, competition and creativity into one digital playground. Here you don’t attend events. You unlock levels. Hackathons become Boss Battles. Dance becomes Rhythm Mode. Music becomes Soundtrack Mode. Fun becomes Multiplayer. Whether you&apos;re a coder, gamer, dancer, singer, designer or explorer — this fest has a quest waiting for you. Insert Coin. Start Game.
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center z-30">
              <div className="border-r-4 border-l-4 border-t-4 border-white w-11/12 h-2/12 bg-black">
                <div className="flex">
                  <div className="flex items-center justify-start mt-[4px] ml-1 gap-1">
                    <div className="rounded-full bg-red-600 w-4 h-4" />
                    <div className="rounded-full bg-yellow-400 w-4 h-4" />
                    <div className="rounded-full bg-green-600 w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-center w-full">
                    <div className="mt-[6px] text-center text-[14px] text-white">/home/arcade</div>
                  </div>
                </div>
              </div>
              <div
                id="terminal"
                ref={terminalRef}
                className="p-3 bg-[#282828] border-4 border-white text-[#33FF33] w-11/12 h-[200px] md:h-[300px] text-left text-[10px] md:text-[14px] headingfont"
              />
            </div>
          </div>
        </div>

        <div className="section text-white home-section" id="events">
          <div className="flex flex-col items-center justify-center min-h-screen w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 mt-4 w-full">
              <div className="col-span-1 order-2 md:order-1 mx-2 my-2 md:my-0">
                <div className="flex flex-col w-full h-full border-4 border-white bg-gray-950 bg-opacity-50">
                  <div className="text-center headingfont text-[12px] md:text-[16px] mb-2 py-1 border-b-4 border-white w-full text-white bg-black">Events</div>
                  <div className="word-box flex flex-row md:flex-col flex-wrap gap-4 justify-start md:justify-center md:items-center text-[9px] md:text-[14px] mt-2 ml-4" />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 order-1 md:order-2">
                <div className="border-t-4 border-l-4 border-r-4 border-white w-full max-w-screen-lg mx-auto">
                  <div className="flex items-center justify-center w-full h-full bg-black">
                    <div className="text-center headingfont text-xl text-white">EVENTS.NES</div>
                  </div>
                </div>
                <div className="w-full max-w-screen-lg mx-auto relative border-4 border-white flex flex-col md:flex-row">
                  <div className="game-container relative w-full" style={{ backgroundColor: '#63adff' }}>
                    <div className="duck-hud">
                      <div className="hud-box headingfont">
                        SCORE <span id="score-value">0</span> | HITS <span id="hits-value">0</span> | MISSES <span id="misses-value">0</span> | SHOTS <span id="shots-value">0</span>
                      </div>
                    </div>
                    <img src="/skills.nes/duckhuntbg.png" className="duckhunt-bg h-full w-full object-cover" alt="Duck Hunt" />
                    <img src="/skills.nes/centerimage.gif" className="gameend-bg hidden h-full w-full object-cover" alt="Game End" />
                    <img src="/skills.nes/flyduck.gif" className="bird hidden absolute w-12 h-12 md:w-20 md:h-20 nes-pointer" alt="Bird" />
                    <button id="start-button" className="bulbula medium buton headingfont nes-pointer">Start Game</button>
                  </div>
                </div> 
              </div>

              <div className="col-span-1 order-3 md:order-3 mx-2 my-2 md:my-0" id="arenas">
                <div className="flex flex-col w-full h-full border-4 border-white bg-gray-950 bg-opacity-50">
                  <div className="text-center headingfont text-[12px] md:text-[16px] mb-2 border-b-4 border-white w-full bg-black text-white py-1">ARENAS</div>
                  <div className="word-box-2 flex flex-row md:flex-col flex-wrap gap-4 justify-start md:justify-center md:items-center text-[9px] md:text-[14px] mt-2 ml-4" />
                </div>
              </div>
            </div>

            <audio id="loop-sound" src="/skills.nes/Intro.mp3" loop />
            <audio id="duckinit-sound" src="/skills.nes/duckinit.mp3" loop />
            <audio id="game-end-sound" src="/skills.nes/gameend.mp3" />
            <audio id="click-sound" src="/skills.nes/shot.mp3" />
            <audio id="fly-sound" src="/skills.nes/wingFlap20sec.mp3" loop />
            <audio id="shot-sound" src="/skills.nes/shot.mp3" />
            <audio id="fall-sound" src="/skills.nes/duckFalling.mp3" />
          </div>
          <img
            ref={bottomRightRef}
            src="/indexbg/bigbottomrightcropped.png"
            alt="Bottom Right"
            className="img bottom-right-image w-[60%] min-[425px]:w-[30%] md:w-[40%] lg:w-[25%] xl:w-[20%] top-[20%] min-[375px]:top-[10%] md:top-[-10%] min-[800px]:w-[30%]"
          />
        </div>

      </div>
    </Layout>
  );
}

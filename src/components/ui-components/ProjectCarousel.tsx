import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Calendar, ChartBar } from '@phosphor-icons/react';
import { projects } from '@/data/projectData';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Draggable);

interface ProjectCarouselProps {
  className?: string;
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ className }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize the carousel
  useEffect(() => {
    if (!carouselRef.current || !trackRef.current) return;

    // Reset refs array
    cardsRef.current = cardsRef.current.slice(0, projects.length);

    const carousel = carouselRef.current;
    const track = trackRef.current;
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

    // Set initial styles
    gsap.set(track, {
      x: 0,
      willChange: 'transform'
    });

    // Initial animation for cards
    gsap.fromTo(cards,
      {
        y: 50,
        opacity: 0,
        rotateX: 15,
        scale: 0.9
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        scale: 1,
        stagger: 0.1,
        duration: 1,
        ease: 'elastic.out(1, 0.7)',
        delay: 0.2
      }
    );

    // Calculate dimensions
    const calculateDimensions = () => {
      if (!carousel || !track || cards.length === 0) return;

      const carouselWidth = carousel.offsetWidth;
      const cardWidth = cards[0].offsetWidth;
      const cardMargin = parseInt(window.getComputedStyle(cards[0]).marginRight);
      const totalCardWidth = cardWidth + cardMargin;

      return { carouselWidth, cardWidth, cardMargin, totalCardWidth };
    };

    // Initialize dimensions
    const dimensions = calculateDimensions();
    if (!dimensions) return;

    // Create draggable instance
    const draggable = Draggable.create(track, {
      type: 'x',
      edgeResistance: 0.65,
      bounds: {
        minX: -((dimensions.totalCardWidth * cards.length) - dimensions.carouselWidth + dimensions.cardMargin),
        maxX: 0
      },
      inertia: true,
      onDragStart: () => setIsDragging(true),
      onDragEnd: function() {
        setIsDragging(false);

        // Calculate the closest card index
        const x = this.endX;
        const newIndex = Math.round(Math.abs(x) / dimensions.totalCardWidth);
        setActiveIndex(Math.min(newIndex, cards.length - 1));

        // Snap to the closest card
        gsap.to(track, {
          x: -newIndex * dimensions.totalCardWidth,
          duration: 0.3,
          ease: 'power2.out'
        });
      },
      onThrowUpdate: function() {
        // Update active index during throw/inertia
        const x = this.x;
        const newIndex = Math.round(Math.abs(x) / dimensions.totalCardWidth);
        setActiveIndex(Math.min(newIndex, cards.length - 1));
      }
    })[0];

    // Add scroll trigger for 3D parallax effect
    cards.forEach((card) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          // 3D parallax effect for card content
          const progress = self.progress;
          const cardContent = card.querySelector('.card-content');
          if (cardContent) {
            gsap.to(cardContent, {
              y: progress * 20,
              duration: 0.1,
              ease: 'none'
            });
          }

          // Add 3D rotation effect based on scroll position
          gsap.to(card, {
            rotateY: (progress - 0.5) * 10, // -5 to 5 degrees rotation
            rotateX: (progress - 0.5) * 5,  // -2.5 to 2.5 degrees rotation
            z: progress * 30,               // 0 to 30px z-translation
            duration: 0.1,
            ease: 'none'
          });
        }
      });

      // Add enhanced 3D hover animations
      card.addEventListener('mouseenter', () => {
        if (isDragging) return;

        gsap.to(card, {
          y: -15,
          scale: 1.05,
          rotateY: 5,
          rotateX: -5,
          z: 50,
          boxShadow: '0 25px 30px -5px rgba(0, 0, 0, 0.2), 0 15px 15px -5px rgba(0, 0, 0, 0.1)',
          duration: 0.4,
          ease: 'power2.out'
        });

        // Animate card content on hover
        const cardContent = card.querySelector('.card-content');
        if (cardContent) {
          gsap.to(cardContent, {
            y: -5,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          rotateY: 0,
          rotateX: 0,
          z: 0,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          duration: 0.4,
          ease: 'power2.out'
        });

        // Reset card content on mouse leave
        const cardContent = card.querySelector('.card-content');
        if (cardContent) {
          gsap.to(cardContent, {
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
      });

      // Add mouse move effect for dynamic 3D rotation
      card.addEventListener('mousemove', (e) => {
        if (isDragging) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element

        // Calculate rotation based on mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 5; // -5 to 5 degrees
        const rotateX = ((centerY - y) / centerY) * 5; // -5 to 5 degrees

        gsap.to(card, {
          rotateY: rotateY,
          rotateX: rotateX,
          duration: 0.1,
          ease: 'power1.out'
        });
      });
    });

    // Handle window resize
    const handleResize = () => {
      const newDimensions = calculateDimensions();
      if (!newDimensions) return;

      // Update draggable bounds
      draggable.applyBounds({
        minX: -((newDimensions.totalCardWidth * cards.length) - newDimensions.carouselWidth + newDimensions.cardMargin),
        maxX: 0
      });

      // Snap to current active card
      gsap.to(track, {
        x: -activeIndex * newDimensions.totalCardWidth,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      draggable.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [activeIndex, isDragging]);

  // Navigate to previous card
  const goToPrev = () => {
    if (activeIndex <= 0) return;

    const newIndex = activeIndex - 1;
    setActiveIndex(newIndex);

    const track = trackRef.current;
    const card = cardsRef.current[0];
    if (!track || !card) return;

    const cardWidth = card.offsetWidth;
    const cardMargin = parseInt(window.getComputedStyle(card).marginRight);

    gsap.to(track, {
      x: -newIndex * (cardWidth + cardMargin),
      duration: 0.8,
      ease: 'expo.out'
    });
  };

  // Navigate to next card
  const goToNext = () => {
    if (activeIndex >= projects.length - 1) return;

    const newIndex = activeIndex + 1;
    setActiveIndex(newIndex);

    const track = trackRef.current;
    const card = cardsRef.current[0];
    if (!track || !card) return;

    const cardWidth = card.offsetWidth;
    const cardMargin = parseInt(window.getComputedStyle(card).marginRight);

    gsap.to(track, {
      x: -newIndex * (cardWidth + cardMargin),
      duration: 0.8,
      ease: 'expo.out'
    });
  };

  return (
    <div className={`${className || ''} relative`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-800">Projects</h2>
        <div className="flex space-x-2">
          <button
            onClick={goToPrev}
            disabled={activeIndex === 0}
            className={`p-2 rounded-full ${activeIndex === 0 ? 'text-gray-300 bg-gray-100' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            disabled={activeIndex === projects.length - 1}
            className={`p-2 rounded-full ${activeIndex === projects.length - 1 ? 'text-gray-300 bg-gray-100' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="overflow-hidden cursor-grab"
        style={{ perspective: '1000px' }}
      >
        <div
          ref={trackRef}
          className="flex space-x-4"
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={el => cardsRef.current[index] = el}
              className={`flex-shrink-0 w-[300px] bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
                activeIndex === index ? 'border-2 border-blue-500' : 'border border-gray-200'
              }`}
            >
              <div className="card-content">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium px-2 py-1 bg-white/20 rounded-full text-white">
                      {project.location || 'Project'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{project.name}</h3>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-1" />
                      <span>{project.date || 'Ongoing'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ChartBar size={16} className="mr-1" />
                      <span>{project.progress || 0}%</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>

                  <Link
                    to={`/project/${project.id}`}
                    className="block w-full text-center py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Project
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        {projects.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              activeIndex === index ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            onClick={() => {
              setActiveIndex(index);

              const track = trackRef.current;
              const card = cardsRef.current[0];
              if (!track || !card) return;

              const cardWidth = card.offsetWidth;
              const cardMargin = parseInt(window.getComputedStyle(card).marginRight);

              gsap.to(track, {
                x: -index * (cardWidth + cardMargin),
                duration: 0.8,
                ease: 'expo.out'
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectCarousel;

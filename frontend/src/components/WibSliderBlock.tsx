'use client'
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
    id: number;
    color: string;
}

export default function WibSliderBlock() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const existingIds = new Set<number>();

    // 🎲 Генерация уникального слайда
    const generateSlide = (): Slide => {
        let id;
        do {
            id = Math.floor(Math.random() * 100000);
        } while (existingIds.has(id));
        existingIds.add(id);
        return { id, color: `hsl(${Math.random() * 360}, 70%, 60%)` };
    };

    // 🧩 Инициализация первых 5 слайдов
    useEffect(() => {
        setSlides(Array.from({ length: 5 }, generateSlide));
    }, []);

    // 🔁 Имитация прихода новых слайдов в произвольный момент
    useEffect(() => {
        const interval = setInterval(() => {
            const newSlide = generateSlide();
            setSlides(prev => [newSlide, ...prev]);

            // Оставляем максимум 20 слайдов
            setSlides(prev => prev.slice(0, 20));
        }, Math.random() * 4000 + 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={styles.wrapper}>
            <div style={styles.slider}>
                <AnimatePresence initial={false}>
                    {slides.map(slide => (
                        <motion.div
                            key={slide.id}
                            layout
                            initial={{ x: -80, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 80, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            style={{
                                ...styles.slide,
                                backgroundColor: slide.color,
                            }}
                        >
                            <span style={styles.text}>#{slide.id}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

// 🎨 Стили
const styles: Record<string, React.CSSProperties> = {
    wrapper: {
        display: "flex",
        justifyContent: "center",
        padding: "20px",
    },
    slider: {
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        overflowX: "auto",
        width: "600px",
        height: "250px",
        border: "2px solid #ccc",
        borderRadius: "12px",
        padding: "16px",
        background: "#f7f7f7",
    },
    slide: {
        flex: "0 0 150px",
        height: "100%",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        color: "white",
        fontWeight: 600,
    },
    text: {
        textShadow: "0 1px 4px rgba(0,0,0,0.5)",
    },
};

'use client'
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/lib/hooks";
import style from '@/styles/winInventoryBlock.module.scss'
import TopSliderItem from '@/components/TopSliderItem'

export type ExteriorWear =
    | "factory_new"
    | "minimal_wear"
    | "field_tested"
    | "well_worn"
    | "battle_scarred";

export type Rarity =
    | "usuall"
    | "rare"
    | "classified"
    | "elite"
    | "epic";

export interface CardItemInt {
    case_id: string | null;
    id: string;
    imgPath: string;
    gunModel: string;
    gunStyle: string;
    rarity: Rarity;
    price: number,
    exterior_wear: ExteriorWear;
    userId: string;
    userImg: string;
    username: string;
    caseImg: string | null;
}


export default function WibSliderBlock(): React.ReactNode {
    const [slides, setSlides] = useState<CardItemInt[]>([]);
    const sliderItems = useAppSelector(state => state.dropSlider.sliderItems)

    const existingIds = new Set<number>();

    const generateSlide = (): Slide => {
        let id;
        do {
            id = Math.floor(Math.random() * 100000);
        } while (existingIds.has(id));
        existingIds.add(id);
        return { id, color: `hsl(${Math.random() * 360}, 70%, 60%)` };
    };

    useEffect(() => {

        if (sliderItems.length <= 0) {
            return;
        }
        setSlides(sliderItems);
    }, [sliderItems]);

    // 🔁 Имитация прихода новых слайдов в произвольный момент
    useEffect(() => {
        const interval = setInterval(() => {
            const newSlide = generateSlide();
            setSlides(prev => [newSlide, ...prev]);

            // Оставляем максимум 20 слайдов
            setSlides(prev => prev.slice(0, 20));
        }, Math.random() * 40000000 + 1000);

        return () => clearInterval(interval);
    }, []);


    if (sliderItems.length <= 0) {
        return null;
    }

    // 🎲 Генерация уникального слайда


    // 🧩 Инициализация первых 5 слайдов

    return (
        <div className={style.sliderCntBlock}>
            <div className={style.sliderCnt}>
                <AnimatePresence initial={false}>
                    {slides.map(value => (
                        <motion.div
                            key={value.id}
                            layout
                            initial={{ x: -80, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 80, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className={style.slide}
                        >
                            <TopSliderItem caseImg={value.caseImg} username={value.username} userImg={value.userImg} userId={value.userId} state={value.exterior_wear} key={value.id} imgPath={value.imgPath} gunModel={value.gunModel} type={value.rarity} gunStyle={value.gunStyle} gunPrice={value.price} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

'use client'
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import style from '@/styles/winInventoryBlock.module.scss'
import TopSliderItem from '@/components/TopSliderItem'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getFromQueue } from "@/redux/dropSliderReducer"

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
    const queueItems = useAppSelector(state => state.dropSlider.queue.items);
    const dispatch = useAppDispatch();

    useEffect(() => {

        if (sliderItems.length <= 0) {
            return;
        }
        setSlides(sliderItems);
    }, [sliderItems]);

    // 🔁 Имитация прихода новых слайдов в произвольный момент
    useEffect(() => {
        if (queueItems.length === 0) return;

        const interval = setInterval(() => {

            const last = queueItems[queueItems.length - 1];
            if (!last) return;

            setSlides(prev => [last, ...prev].slice(0, 20));
            dispatch(getFromQueue());
        }, Math.random() * 3000 + 1000);

        return () => clearInterval(interval);
    }, [queueItems, dispatch]);


    if (sliderItems.length <= 0) {
        return null;
    }

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

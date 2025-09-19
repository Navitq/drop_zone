'use client'

import React, { useEffect, useRef, useState } from "react";
import style from '@/styles/upgrades.module.scss'
import CaseBtnText from '@/components/CaseBtnText'
import { useTranslations } from "next-intl";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { showNoMoneyModal, showUnAuthModal } from '@/redux/modalReducer'
import { AxiosError } from "axios";

import api from "@/lib/api";
import { BACKEND_PATHS } from '@/utilites/urls';
import { clearServerItemToUpgrade, clearItemToUpgrade, addOneItemsFrom, clearGameState, setGameState } from '@/redux/upgradeReducer'
import { showRafflesStateModal } from '@/redux/modalReducer'
import { deductMoney } from '@/redux/userReducer'

function ChanceSpinerExchanger({ size = 250, strokeWidth = 12, initialPercent = 0 }) {
    const [percent, setPercent] = useState(initialPercent);
    const price = useAppSelector(state => state.upgrade.price)
    const clientItemId = useAppSelector(state => state.upgrade.itemData.id)
    const serverItemId = useAppSelector(state => state.upgrade.itemServerData.id)
    const serverPrice = useAppSelector(state => state.upgrade.serverPrice)
    const gameState = useAppSelector(state => state.upgrade.gameState)
    const itemToDelete = useAppSelector(state => state.upgrade.upgradeFinished.itemToDelete)
    const [rotation, setRotation] = useState(0);
    const t = useTranslations('upgrades')
    const svgRef = useRef(null);

    const dispatch = useAppDispatch()

    const padding = 30; // внутренний отступ для тени
    const svgSize = size + padding * 2;
    const center = svgSize / 2;

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    useEffect(() => {
        dispatch(clearGameState())
    }, [dispatch, clientItemId, serverItemId])

    useEffect(() => {
        if (price === 0 || serverPrice === 0) {
            setPercent(0);
        } else {
            const localPersentage = parseFloat((price / (serverPrice * 1.05) * 100).toFixed(2));
            if (localPersentage > 90) {
                setPercent(90);
            } else if (localPersentage < 1) {
                setPercent(1);
            } else {
                setPercent(localPersentage);
            }
        }

    }, [price, serverPrice])

    async function upgradeItem() {
        try {
            if (!serverItemId || (itemToDelete === clientItemId && clientItemId !== "") || price === 0) {
                dispatch(clearServerItemToUpgrade())
                dispatch(clearItemToUpgrade())
                dispatch(showRafflesStateModal({ title: t('attention'), sub_title: t('attention_sub_title') }))
                return;
            }
            const response = await api.post(BACKEND_PATHS.upgradeItem, clientItemId ? { clientItemId, serverItemId } : { price, serverItemId });
            if (clientItemId === "" && price != 0) {
                dispatch(deductMoney(price))
            }
            if (response?.status === 201) {
                if (response.data.items) {
                    dispatch(addOneItemsFrom({ newItem: response.data.items, itemToDelete: clientItemId }))
                } else {
                    dispatch(addOneItemsFrom({ itemToDelete: clientItemId }))
                }
                dispatch(setGameState({ text: t('result_win'), result: "win" }))
            } else if (response?.status === 202) {
                dispatch(setGameState({ text: t('result_lose'), result: "lose" }))
                dispatch(addOneItemsFrom({ itemToDelete: clientItemId }))
            }
            spin({ from: rotation, to: rotation + 1080, duration: 2000 })
        } catch (err) {
            const error = err as AxiosError;
            console.log(error.status)
            if (error.response?.status === 401) {
                dispatch(showUnAuthModal())
            } else if (error.response?.status === 402) {
                dispatch(showNoMoneyModal())
            } else {
                console.error("Неизвестная ошибка", error);
            }
        }

    }

    // const updatePercent = (clientX, clientY) => {
    //     if (!svgRef.current) return;
    //     const rect = svgRef.current.getBoundingClientRect();
    //     const x = clientX - (rect.left + center);
    //     const y = clientY - (rect.top + center);

    //     let angle = Math.atan2(x, -y) * (180 / Math.PI);
    //     if (angle < 0) angle += 360;

    //     const newPercent = Math.min(Math.max((angle / 360) * 100, 0), 100);
    //     setPercent(newPercent);
    // };

    // const handleMouseDown = (e) => {
    //     e.preventDefault();
    //     updatePercent(e.clientX, e.clientY);

    //     const handleMouseMove = (ev) => updatePercent(ev.clientX, ev.clientY);
    //     const handleMouseUp = () => {
    //         window.removeEventListener("mousemove", handleMouseMove);
    //         window.removeEventListener("mouseup", handleMouseUp);
    //     };

    //     window.addEventListener("mousemove", handleMouseMove);
    //     window.addEventListener("mouseup", handleMouseUp);
    // };

    // функция анимации вращения
    function spin({
        from = 0,
        to = 360,
        duration = 1000,
        easing = easeOutCubic
    } = {}) {
        const start = performance.now();
        const delta = to - from;

        function step(timestamp) {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easing(progress);

            setRotation(from + delta * eased);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    // плавное замедление
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    return (
        <div className={style.exchangerSpiner}>
            <svg
                ref={svgRef}
                width={svgSize}
                height={svgSize}
                style={{ cursor: "pointer", background: "transparent" }}
            // onMouseDown={handleMouseDown}
            >
                <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="20" result="blur" />
                        <feFlood floodColor="rgba(0,0,0,0.8)" result="color" />
                        <feComposite in="color" in2="blur" operator="in" result="shadow" />
                        <feMerge>
                            <feMergeNode in="shadow" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="15" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Фоновой круг */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#33333C"
                    strokeWidth={strokeWidth}
                    fill="none"
                    filter="url(#shadow)"
                />

                {/* Основной прогресс */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#E58500"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform={`rotate(-90 ${center} ${center})`}
                    filter="url(#glow)"
                />

                {/* Текст */}
                <text
                    x={center}
                    y={center - 12}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                >
                    {gameState.visible && (
                        <tspan
                            x={center}
                            dy="-25"        // поднимаем вверх только если видим
                            fontSize="26px"
                            fontFamily="var(--font-headBold)"
                            fill={gameState.result === "win" ? "green" : gameState.result === "lose" ? "red" : "white"}
                        >
                            {gameState.text}
                        </tspan>
                    )}
                    <tspan x={center} dy={gameState.visible ? "40" : "0"} fontSize="32px" fontFamily="var(--font-headBold)">
                        {percent.toFixed(2)}%
                    </tspan>
                    <tspan
                        x={center}
                        dy="35"
                        fontSize="20px"
                        fontFamily="var(--font-headRegular)"
                    >
                        {t('your_chance')}
                    </tspan>
                </text>

                {/* Указатель */}
                <svg
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transformOrigin: "50% 50%",
                    }}
                    x={center - 26}
                    y={center - radius + strokeWidth / 2}
                    width="52"
                    height="49"
                    viewBox="0 0 52 49"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g clipPath="url(#clip0_4775_10958)">
                        <g filter="url(#filter0_di_4775_10958)">
                            <path d="M25.5 40C16.9394 40 10 33.1949 10 24.8V23.6923C10.6275 15.3641 17.6768 8.66667 25.5 0C33.6684 9.04615 41 15.8974 41 24.8C41 33.1949 34.0606 40 25.5 40ZM35.9588 24.7897C35.9588 19.1251 31.2764 14.5333 25.5 14.5333C19.7236 14.5333 15.0412 19.1251 15.0412 24.7897C15.0412 30.4544 19.7236 35.0462 25.5 35.0462C31.2764 35.0462 35.9588 30.4544 35.9588 24.7897Z" fill="#36343B" />
                            <path d="M35.9588 24.7897C35.9588 19.1251 31.2764 14.5333 25.5 14.5333C19.7236 14.5333 15.0412 19.1251 15.0412 24.7897C15.0412 30.4544 19.7236 35.0462 25.5 35.0462C31.2764 35.0462 35.9588 30.4544 35.9588 24.7897Z" fill="#36343B" />
                        </g>
                        <g filter="url(#filter1_ddi_4775_10958)">
                            <circle cx="10" cy="10" r="10" transform="matrix(1 0 0 -1 16 35)" fill="url(#paint0_radial_4775_10958)" shapeRendering="crispEdges" />
                        </g>
                    </g>

                    <defs>
                        {/* твои фильтры и градиенты */}
                        <filter id="filter0_di_4775_10958" x="2" y="-8" width="55" height="64" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feOffset dx="4" dy="4" />
                            <feGaussianBlur stdDeviation="6" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0.293269 0 0 0 0 0.293269 0 0 0 0 0.293269 0 0 0 0.2 0" />
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4775_10958" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4775_10958" result="shape" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feOffset dx="1" />
                            <feGaussianBlur stdDeviation="1.5" />
                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0.466346 0 0 0 0 0.466346 0 0 0 0 0.466346 0 0 0 1 0" />
                            <feBlend mode="normal" in2="shape" result="effect2_innerShadow_4775_10958" />
                        </filter>
                        <filter id="filter1_ddi_4775_10958" x="11" y="10" width="30" height="30" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feOffset />
                            <feGaussianBlur stdDeviation="2" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4775_10958" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feOffset />
                            <feGaussianBlur stdDeviation="2.5" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
                            <feBlend mode="normal" in2="effect1_dropShadow_4775_10958" result="effect2_dropShadow_4775_10958" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_4775_10958" result="shape" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feOffset dy="-4" />
                            <feGaussianBlur stdDeviation="5" />
                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                            <feBlend mode="normal" in2="shape" result="effect3_innerShadow_4775_10958" />
                        </filter>
                        <radialGradient id="paint0_radial_4775_10958" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12.5 8.5) rotate(102.265) scale(11.7686)">
                            <stop offset="0.350962" stopColor="#FFB042" stopOpacity="0.9" />
                            <stop offset="1" stopColor="#5A3500" />
                        </radialGradient>
                        <clipPath id="clip0_4775_10958">
                            <rect width="52" height="56" fill="white" transform="matrix(1 0 0 -1 0 49)" />
                        </clipPath>
                    </defs>
                </svg>
            </svg>

            {/* кнопка запуска */}
            <CaseBtnText onClick={() => { upgradeItem() }} text={t('upgrade_text')}></CaseBtnText>
            {/* <button
                className={style.spinerBtn}
                style={{ color: "#ffffff" }}
                onClick={() => spin({ from: rotation, to: rotation + 1080, duration: 2000 })}
            >

            </button> */}
        </div>
    );
}

export default ChanceSpinerExchanger;

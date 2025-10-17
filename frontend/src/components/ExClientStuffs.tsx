'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import style from '@/styles/upgrades.module.scss'
import ItemSm from '@/components/ItemSm'

import { AxiosError } from "axios";

import api from "@/lib/api";
import { useAppDispatch } from '@/lib/hooks';
import { removeFinishedItem } from '@/redux/upgradeReducer'
import ShouldAuthStaff from '@/components/ShouldAuthStaff'
import { removeDeletedItems } from '@/redux/contractsReducer'

interface upgradeFinished {
    newItem: gunItemModel,
    itemToDelete: string | string[],
}

interface ExClientStuffsInt {
    targetUrl: string,
    body: {
        client_id?: string,
        limit: number,
        startPrice?: number
    }
    activateBtn: (value: gunItemModel) => void,
    addPrize?: upgradeFinished,
    client_id?: string | string[],
    server_id?: string,
    btnText: string,
    subTitleText?: string,
    titleText: string,
    linkTo?: string,
    removeItem?: (value: gunItemModel) => void,
    deleteTxt?: string,
    isContracts?: boolean,
    isActiveProfile?: boolean,
    deleteProfileItem?: string[],
    activeBtlText?: string,
    profileDeletedItems?: string,
    sortType?: number,
    textSortValue?: string,
    itemPriceAndAmount?: (value: gunItemModel[]) => void
}


interface gunItemModel {
    id: string,
    imgPath: string,
    gunModel: string,
    gunStyle: string,
    gunPrice: number,
    state: 'factory_new' | 'minimal_wear' | 'field_tested' | 'well_worn' | 'battle_scarred',
    type: "usuall" | "rare" | "elite" | "epic" | "classified",
}

function ExClientStuffs(props: ExClientStuffsInt): React.ReactNode {
    const [items, setItems] = useState<gunItemModel[]>([])
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const loadingRef = useRef<boolean>(loading);
    const totalDeletedRef = useRef<string[]>([]);
    const hasMoreRef = useRef<boolean>(hasMore);
    const multiplyRef = useRef<boolean>(true)
    const addedItemsListRef = useRef<string[]>([])
    const currentSortValue = useRef<number>(0)
    const [couldObserve, setCouldObserve] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!props.sortType || (props.sortType == 1 && currentSortValue.current == 0)) return;
        currentSortValue.current = props.sortType;
        hasMoreRef.current = true;
        loadingRef.current = false;
        multiplyRef.current = false;
        totalDeletedRef.current = [];
        addedItemsListRef.current = [];
        setItems([]);
        setPage(1);
        setHasMore(true);


        // Загружаем первую страницу заново
        getInventory(1);
    }, [props.sortType]);

    useEffect(() => {
        if (!props.textSortValue && props.textSortValue !== '') return;
        hasMoreRef.current = true;
        loadingRef.current = false;
        multiplyRef.current = false;
        totalDeletedRef.current = [];
        addedItemsListRef.current = [];
        setItems([]);
        setPage(1);
        setHasMore(true);


        // Загружаем первую страницу заново
        getInventory(1);
    }, [props.textSortValue]);

    useEffect(() => {
        console.log(props.isActiveProfile, props.deleteProfileItem, props.deleteProfileItem?.length == 0)
        if (!props.isActiveProfile || !props.deleteProfileItem || props.deleteProfileItem.length == 0) {
            return;
        }

        console.log(676869656461626366)
        setItems(prevItems => {
            const newItems = prevItems.filter(
                item => !props.deleteProfileItem!.includes(item.id)
            );

            if (newItems.length === prevItems.length) {
                return prevItems;
            }
            return newItems;
        });

    }, [props.deleteProfileItem])

    useEffect(() => {
        if (props.itemPriceAndAmount) {
            props.itemPriceAndAmount(items)
        }
    }, [items])

    useEffect(() => {
        if (!props.profileDeletedItems) {
            return
        }
        totalDeletedRef.current.push(props.profileDeletedItems)
        console.log(totalDeletedRef.current)
    }, [props.profileDeletedItems])

    useEffect(() => {
        if (!props.addPrize) return;

        addedItemsListRef.current = addedItemsListRef.current.filter((item) => {
            const toDelete = props?.addPrize?.itemToDelete;

            if (Array.isArray(toDelete)) {
                return !toDelete.includes(item); // если массив — проверяем через includes
            }

            return item !== toDelete; // если строка
        });



        setItems((state) => {
            let newState = [...state];

            // сначала удаляем
            if (props?.addPrize?.itemToDelete) {
                const toDelete = props.addPrize.itemToDelete;

                if (Array.isArray(toDelete)) {
                    // фильтруем и добавляем все удалённые id
                    newState = newState.filter(item => {
                        const shouldDelete = toDelete.includes(item.id);
                        if (shouldDelete) {
                            totalDeletedRef.current.push(item.id);
                        }
                        return !shouldDelete;
                    });
                } else {
                    // фильтруем и добавляем один id
                    newState = newState.filter(item => {
                        const shouldDelete = item.id === toDelete;
                        if (shouldDelete) {
                            totalDeletedRef.current.push(item.id);
                        }
                        return !shouldDelete;
                    });
                }
            }


            // потом добавляем
            if (props?.addPrize?.newItem?.id) {
                newState = [props.addPrize.newItem, ...newState,];
                addedItemsListRef.current.push(props?.addPrize?.newItem?.id)
            }

            return newState;
        });
        // диспатч отдельно, после setItems
        if (props.addPrize?.newItem?.id && !props.isContracts) {
            setTimeout(() => {
                dispatch(removeFinishedItem());
            }, 0);
        } else if (props.addPrize?.newItem?.id && props.isContracts) {
            setTimeout(() => {
                dispatch(removeDeletedItems());
            }, 0);
        }
    }, [props.addPrize]);

    useEffect(() => {
        if (!multiplyRef.current) {
            multiplyRef.current = true;
            return
        }
        getInventory(page)
    }, [page]);

    useEffect(() => {
        if (!props.body.startPrice) {
            return
        }
        setHasMore(true);
        hasMoreRef.current = true;
        loadingRef.current = true;
        setItems([]);

        // говорим эффекту [page] пропустить первый вызов

        getInventory(1); // вызываем один раз сразу
    }, [props.body.startPrice]);


    useEffect(() => {
        loadingRef.current = loading;
        hasMoreRef.current = hasMore;
    }, [loading, hasMore]);

    useEffect(() => {
        if (!couldObserve) {
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {

                if (entries[0].isIntersecting && !loadingRef.current && hasMoreRef.current) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0 }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [couldObserve]);

    useEffect(() => {
        // включаем observer, только если есть items
        setCouldObserve(items.length > 0);
    }, [items.length]);


    async function getInventory(page: number = 1) {
        try {
            console.log(props.targetUrl, hasMoreRef.current)
            if (!props.targetUrl || !hasMoreRef.current) {
                return
            }
            setLoading(true);
            let filteredDeletedLength = 0;
            console.log(totalDeletedRef.current, addedItemsListRef)
            if (totalDeletedRef.current.length > 0) {
                const filteredDeletedIds = totalDeletedRef.current.filter(
                    id => !addedItemsListRef.current.includes(id)
                );
                if (filteredDeletedIds.length > 0) {
                    filteredDeletedLength = filteredDeletedIds.length;
                }
                totalDeletedRef.current = []
            }
            console.log(222222222222222222222222)
            const response = await api.post(props.targetUrl, {
                page,
                body: props.body,
                filteredDeletedLength,
                sort_by: props.sortType || 1,
                textSortValue: props.textSortValue || ''
            });
            console.log(response.data)
            if (response?.status == 204) {
                setHasMore(false)
                return;
            } else if (response.data.items.length < props.body.limit) {
                setHasMore(false)
            }
            setItems((state) => {
                const filteredItems = response.data.items.filter(
                    (item: gunItemModel) => !addedItemsListRef.current.includes(item.id)
                );
                return [...state, ...filteredItems];
            });
        } catch (err) {
            const error = err as AxiosError;
            if (error.response?.status === 401) {
                return;
            } else if (error.response?.status === 404) {
                console.log('some action')
            } else {
                console.error("Неизвестная ошибка", error);
            }
            setHasMore(false)
        } finally {
            setLoading(false);
        }
    }

    const handleActivate = useCallback(
        (item: gunItemModel) => () => {
            props.activateBtn(item)
        },
        [props.activateBtn]
    );

    const handleRemove = useCallback(
        (item: gunItemModel) => () => {
            if (props.removeItem) {
                props.removeItem(item);
            }
            // Если props.removeItem нет — функция просто ничего не делает
        },
        [props.removeItem]
    );

    return (
        (
            items.length > 0 ? (<div key={props.sortType} className={`${style.ExClientStuffs} ${'ExClientStuffs'}`}>
                {
                    items.map((value, index) => {
                        const isActive = props.client_id
                            ? Array.isArray(props.client_id)
                                ? props.client_id.includes(value.id)
                                : props.client_id === value.id
                            : props.server_id
                                ? props.server_id === value.id
                                : false;

                        return (
                            <ItemSm
                                isActiveProfile={props.isActiveProfile}
                                key={value.id + index + props.sortType}
                                id={value.id}
                                imgPath={value.imgPath}
                                gunModel={value.gunModel}
                                gunStyle={value.gunStyle}
                                gunPrice={value.gunPrice}
                                type={value.type}
                                state={value.state}
                                activateBtnColor={props.isActiveProfile ? props.isActiveProfile : isActive}
                                activateBtn={handleActivate(value)}
                                deleteBtn={handleRemove(value)}
                                deleteTxt={props.deleteTxt ? props.deleteTxt : ""}
                                activeBtlText={props.activeBtlText ? props.activeBtlText : ""}
                            />
                        );
                    })
                }
                <div ref={loaderRef} style={{ height: 5, visibility: 'hidden' }} />
            </div >
            ) : (

                <>
                    <ShouldAuthStaff btnText={props.btnText} subTitleText={props.subTitleText ? props.subTitleText : ""} titleText={props.titleText} linkTo={props.linkTo ? props.linkTo : ""} ></ShouldAuthStaff >
                </>
            )
        )
    )
}

export default ExClientStuffs

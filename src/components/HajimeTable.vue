<template>
    <div class="table">
        <div class="table__header" :style="`display: grid; grid-template-columns: ${gridColumnsValue};`">
            <div v-for="(header, index) in headers" :key="index" class="column">
                <div :class="`cell ${index < headers.length - 1 ? 'idx' : ''}`" @click="handleSort(index)">
                    {{ header.text }}

                    <span class="sort">
                        <img v-if="header.sort" :src="getSortIcon(header.sort)" alt="sort">
                    </span>
                </div>
            </div>
        </div>
        <div ref="tableBody" class="table__body"
            :style="`display: grid; grid-template-columns: ${gridColumnsValue}; grid-column: 1 / 6;`"
            @scroll="handleScroll">
            <div v-for="(header, index) in headers" :key="index" class="column">
                <div v-for="(item, index) in items" :key="index" :class="`cell ${getCellClass(item, index)}`"
                    @mouseover="handleMouseOver(index)" @mouseleave="handleMouseLeave"
                    @click="handleSelect(item.userId)">
                    {{ item[header.value] }}
                </div>
            </div>
        </div>
        <div v-if="!isLesserData" class="scrollbar">
            <div class="thumb" :style="{ height: thumbHeight + 'px', top: thumbTop + 'px' }" @mousedown="startDrag">
            </div>
        </div>
    </div>
</template>
<script>
import { getListItems, headers } from '../data.js';

import sortAsc from '@images/ic_asc_sort.svg'
import sortDesc from '@images/ic_desc_sort.svg'

export default {
    data() {
        return {
            items: [],
            originItems: [],
            headers: [],
            selectedIndex: -1,
            hoverIndex: -1,
            selectedItem: {},
            isLesserData: false,
            thumbHeight: 0,
            thumbTop: 0,
            isDragging: false,
            startY: 0,
            startThumbTop: 0,
        };
    },
    computed: {
        scrollConfig() {
            const tableBody = this.$refs.tableBody;

            return {
                scrollHeight: tableBody.scrollHeight, // Tổng chiều cao nội dung cuộn
                clientHeight: tableBody.clientHeight, // Chiều cao hiển thị của vùng cuộn
                scrollbarHeight: tableBody.offsetHeight - 20, // Chiều cao của rãnh scrollbar (scrollbar div)
            };
        },
        gridColumnsValue() {
            const colsWidth = this.headers.map(header => header.width || 'auto');
            return colsWidth.join(' ');
        },
    },
    created() {
        const initItems = [...getListItems(30)];
        this.items = [...initItems];
        this.originItems = [...initItems];
        this.headers = [...headers];
    },
    mounted() {
        this.handleCheckDataLesser();
        this.$nextTick(() => {
            this.updateThumb();

            window.addEventListener('mousemove', this.drag);
            window.addEventListener('mouseup', this.stopDrag);
        });
    },
    beforeUnmounted() {
        window.removeEventListener('mousemove', this.drag);
        window.removeEventListener('mouseup', this.stopDrag);
    },
    methods: {
        handleMouseOver(index) {
            this.hoverIndex = index;
        },
        handleMouseLeave() {
            this.hoverIndex = -1;
        },
        getCellClass(item, index) {
            let rltClass = '';
            if (index % 2 === 0) rltClass += ' even';
            else rltClass += ' odd';

            if (this.hoverIndex === index) rltClass += ' hovered';
            if (this.selectedIndex === item.userId) rltClass += ' selected';

            return rltClass;
        },
        handleCheckDataLesser() {
            const tableBody = this.$refs.tableBody;
            if (tableBody.offsetHeight === tableBody.scrollHeight) {
                this.isLesserData = true;
            } else {
                this.isLesserData = false;
            }
        },
        handleSelect(id) {
            if (this.selectedIndex === id) {
                this.handleResetSelect();
            } else {
                this.selectedIndex = id;
                this.selectedItem = this.items.find(item => item.userId === id) || {};
            }
        },
        handleSort(clickedIndex) {
            this.headers = this.headers.map((header, index) => {
                if (clickedIndex === index) {
                    if (header.sort === 'asc') {
                        return { ...header, sort: 'desc' };
                    } else if (header.sort === 'desc') {
                        return { ...header, sort: '' };
                    } else {
                        return { ...header, sort: 'asc' };
                    }
                } else {
                    return { ...header, sort: '' };
                }
            });

            const colName = this.headers[clickedIndex].value;
            const sortDirection = this.headers[clickedIndex].sort;
            if (sortDirection) {
                this.sortColumn(colName, sortDirection);
            } else {
                this.items = [...this.originItems];
            }
        },
        handleResetSelect() {
            this.selectedIndex = -1
            this.selectedItem = {}
        },
        sortColumn(columnName, sortDirection) {
            const sortFactor = sortDirection === 'asc' ? 1 : -1;

            const sortItems = this.items.sort((itemA, itemB) => {
                const valueA = itemA[columnName];
                const valueB = itemB[columnName];

                let comparison = 0;
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    // Sắp xếp chuỗi không phân biệt chữ hoa/thường, hoặc theo ngôn ngữ cụ thể
                    comparison = valueA.localeCompare(valueB, undefined, { sensitivity: 'base' });
                } else {
                    // Sắp xếp số hoặc các kiểu dữ liệu có thể so sánh trực tiếp
                    if (valueA > valueB) {
                        comparison = 1;
                    } else if (valueA < valueB) {
                        comparison = -1;
                    }
                }

                // Áp dụng hệ số sắp xếp
                return comparison * sortFactor;
            });

            this.items = [...sortItems];
        },
        updateThumb() {
            const tableBody = this.$refs.tableBody;
            if (!tableBody) return;

            // Tính chiều cao của thumb
            this.thumbHeight = this.computeThumbHeight(this.scrollConfig)

            // Cập nhật vị trí của thumb dựa trên scrollbar
            this.handleScroll();
        },
        handleScroll() {
            const tableBody = this.$refs.tableBody;
            if (!tableBody) return;

            const scrollTop = tableBody.scrollTop;

            // Tính toán vị trí của thumb
            // thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (scrollbarHeight - this.thumbHeight);
            // Đảm bảo thumbTop không vượt quá rãnh
            this.thumbTop = this.computeScrollThumbTop(scrollTop, this.thumbHeight, this.scrollConfig);
        },
        startDrag(e) {
            this.isDragging = true;
            this.startY = e.clientY;
            this.startThumbTop = this.thumbTop;
            e.preventDefault(); // Ngăn chặn hành vi mặc định của trình duyệt
        },
        drag(e) {
            if (!this.isDragging) return;

            const tableBody = this.$refs.tableBody;
            if (!tableBody) return;

            const deltaY = e.clientY - this.startY;
            const scrollbarHeight = tableBody.offsetHeight - 20; // Chiều cao của rãnh scrollbar (scrollbar div)
            const scrollRange = scrollbarHeight - this.thumbHeight; // Phạm vi di chuyển của thumb

            // Tính toán vị trí mới của thumb
            this.thumbTop = this.computeDragThumbTop(scrollRange, this.startThumbTop, deltaY);

            // Đồng bộ hóa vị trí cuộn của tableBody với vị trí của thumb
            tableBody.scrollTop = this.computeDragScrollTop(scrollRange, this.thumbTop, this.scrollConfig);
        },
        stopDrag() {
            this.isDragging = false;
        },
        computeDragScrollTop(scrollRange, thumbTop, scrollConfig) {
            const { scrollHeight, clientHeight } = scrollConfig;
            return (thumbTop / scrollRange) * (scrollHeight - clientHeight);
        },
        computeScrollThumbTop(scrollTop, thumbHeight, scrollConfig) {
            const { scrollHeight, clientHeight, scrollbarHeight } = scrollConfig;

            let newThumbTop = (scrollTop / (scrollHeight - clientHeight)) * (scrollbarHeight - thumbHeight);
            newThumbTop = Math.max(0, Math.min(newThumbTop, scrollbarHeight - thumbHeight));

            return newThumbTop;
        },
        computeDragThumbTop(scrollRange, startThumbTop, deltaY) {
            let newThumbTop = startThumbTop + deltaY;
            newThumbTop = Math.min(Math.max(0, newThumbTop), scrollRange); // Giới hạn trong phạm vi

            return newThumbTop;
        },
        computeThumbHeight({ clientHeight, scrollHeight, scrollbarHeight }) {
            let thumbHeight = (clientHeight / scrollHeight) * scrollbarHeight;
            thumbHeight = Math.max(thumbHeight, 20); // Đảm bảo thumb không quá nhỏ

            return thumbHeight;
        },
        getSortIcon(isAsc) {
            console.log('sort', sortAsc, sortDesc);
            return isAsc === 'asc' ? sortAsc : sortDesc;
        },
        isEmpty(obj) {
            return Object.keys(obj).length === 0 && obj.constructor === Object;
        },
    }
};
</script>
<style lang="scss" scoped>
$background-color_1: #0057fe;

.table {
    position: relative;
    border: 1px solid #a1a1af;

    & .table__header {
        background-color: $background-color_1;
        font-weight: bolder;
        color: #fff;

        & .cell {
            cursor: pointer;

            &.idx {
                &::before {
                    content: "";
                    position: absolute;
                    top: 5px;
                    height: 21px;
                    right: 0;
                    border: 1px solid;
                }
            }
        }
    }

    & .table__body {
        height: 400px;
        overflow-y: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
            display: none;
        }

        & .column {
            .cell {
                color: #000;

                &.odd {
                    background-color: #f6f6f6;
                }

                &.even {
                    background-color: #e9e9e9;
                }

                &.selected {
                    background: #85cbe9 !important;
                }

                &.hovered {
                    background: #beddea;
                }
            }
        }
    }

    & .scrollbar {
        position: absolute;
        top: 43px;
        bottom: 10px;
        right: 5px;
        width: 10px;
        background-color: transparent;
        border-radius: 5px;
        z-index: 2;

        & .thumb {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 68px;
            background-color: #a1a1af;
            border: 2px solid #f0f0f0;
            box-sizing: border-box;
            border-radius: 5px;
            cursor: grab;
        }
    }

    & .column {
        width: 100%;

        .cell {
            position: relative;
            display: flex;
            padding: 5px;
            margin: auto;
            user-select: none;
            justify-content: space-between;
            align-items: center;

            .sort {
                display: flex;
                align-items: center;

                & img {
                    width: 20px;
                    height: 20px;
                }
            }
        }
    }

    &.lesser {
        .table__header {
            &::-webkit-scrollbar {
                display: none;
            }
        }

        .table__body {
            &::-webkit-scrollbar {
                display: none;
            }
        }
    }
}
</style>
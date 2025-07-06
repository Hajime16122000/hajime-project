<template>
    <div class="detail">
        <h3 class="detail__title">Detail</h3>
        <div class="form">
            <input type="hidden" v-model="detailData.userId">
            <div class="grid__box double">
                <div class="form__input">
                    <label for="userName">User Name</label>
                    <input v-model="detailData.userName" class="detail__input" type="text" id="userName">
                </div>
            </div>
            <div class="grid__box">
                <div class="form__input">
                    <label for="age">Age</label>
                    <input v-model.number="detailData.age" class="detail__input" type="text" id="age">
                </div>
            </div>
            <div class="grid__box double">
                <div class="form__input">
                    <label for="dateOfBirth">Date Of Birth</label>
                    <input v-model="detailData.dateOfBirth" class="detail__input" type="text" id="dateOfBirth">
                </div>
            </div>
            <div class="grid__box">
                <div class="form__input">
                    <label for="gender">Gender</label>
                    <input v-model="detailData.gender" class="detail__input" type="text" id="gender">
                </div>
            </div>
        </div>
        <div class="form__btns">
            <base-button class="btn__del" @click="confirmDelete">Delete</base-button>
            <base-button class="btn__reset" @click="handleReset">Reset</base-button>
            <base-button class="btn__save" :disabled="disabledSave" @click="confirmSave">Save</base-button>
        </div>
    </div>
    <Teleport to="body">
        <base-modal ref="delModal" @confirm="handleDelete" :message="notiMsg" />
        <base-modal ref="saveModal" @confirm="handleSave" :message="notiMsg" />
    </Teleport>
</template>
<script>
import _ from 'lodash';

const DEFAULT_DETAIL_DATA = {
    id: '',
    userName: '',
    age: '',
    gender: '',
    dateOfBirth: '',
};

export default {
    props: {
        selectedItem: {
            type: Object,
            default: () => { },
        },
    },
    emits: ['deleted'],
    data() {
        return {
            detailData: {},
            notiMsg: '',
        };
    },
    computed: {
        disabledSave() {
            console.log('equal', this.detailData, this.selectedItem);
            return !this.isEmpty(this.selectedItem) ? _.isEqual(this.detailData, this.selectedItem) : false;
        },
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
    watch: {
        selectedItem(newVal) {
            this.detailData = { ...newVal };
        },
    },
    methods: {
        confirmDelete() {
            this.openDeleteModal('Would you delete?');
        },
        confirmSave() {
            this.openSaveModal('Would you save?');
        },
        handleDelete() {
            if (!this.isEmpty(this.selectedItem)) {
                let deleteId = this.selectedItem.userId;
                this.items = this.items.filter((item) => item.userId !== deleteId);
            }

            this.$emit('deleted');
        },
        handleSave() {
        },
        handleReset() {
            this.detailData = { ...DEFAULT_DETAIL_DATA };
        },
        isEmpty(obj) {
            return Object.keys(obj).length === 0 && obj.constructor === Object;
        },
        openDeleteModal(msg) {
            this.notiMsg = msg;
            this.$refs.delModal.open();
        },
        openSaveModal(msg) {
            this.notiMsg = msg;
            this.$refs.saveModal.open();
        },
    },
};
</script>
<style lang="scss" scoped>
$color_1: #fff;
$color_2: black;

.detail {
    position: relative;
    border: 1px solid #a1a1af;
    padding: 20px 10px 10px;

    & .detail__title {
        position: absolute;
        top: -12px;
        padding: 0 10px;
        margin: 0;
        background: $color_1;
    }

    & .form {
        display: grid;
        grid-template-columns: 33.333% 33.333% 33.333%;

        & .grid__box {
            display: grid;
            grid-column: span 1;
            padding: 6px;

            &.double {
                grid-column: span 2;
            }

            &.triple {
                grid-column: span 3;
            }

            & .form__input {
                display: flex;
                flex-direction: column;
                gap: 10px;
                width: auto;

                & .detail__input {
                    height: 24px;
                    border: none;
                    outline: none;
                    padding: 0 10px;
                    border: 2px solid #e9e9e9;
                    background: #e9e9e9;
                    color: $color_2;

                    &:focus {
                        background: #fff;
                    }
                }
            }
        }


    }

    & .form__btns {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 12px 6px;
        gap: 12px;

        & :deep(.btn) {
            background: #0057fe;
            color: #fff;

            &.btn__save:disabled {
                background: #0055f94d;
                cursor: unset;
            }
        }
    }
}
</style>
<template>
    <Header title="Manage Group" @go-back="handleGoBack" />
    <div class="group-manage-container">
        <el-form label-width="110px" :model="form" class="demo-from-inline">
            <el-form-item label="Group Name:">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
        </el-form>
        <div v-if="groupList.length > 0" @click="handleClickGroupItem(group)" class="loop-word-item"
            v-for="group in groupList" :key="group._id">
            <div class="loop-word-left">
                <div class="loop-word-left-top">{{ group.name }}</div>
                <div class="loop-word-left-bottom">Child Group: {{ group.childCount || 0 }}</div>
            </div>
            <div class="loop-word-right">
                <div class="loop-word-right-left">
                    <!-- <button @click="handleClick('manage', group._id)">
                        <span>Words</span>
                    </button> -->
                    <!-- <button @click="handleClick('cycling', group._id)">
                        <span>Cycling</span>
                    </button> -->
                </div>
                <div class="loop-word-right-right">

                    <button @click.stop="handleClick('setting', group._id)">
                        <span>Settings</span>
                    </button>
                    <button @click.stop="handleClick('delete', group._id)">
                        <span>Delete</span>
                    </button>
                </div>

            </div>
        </div>
        <el-empty description="No Data." v-else />
        <div class="group-manage-bottom-btn">
            <el-button @click="createGroup" type="primary">Confirm</el-button>
        </div>
        <el-dialog v-model="groupDialog" title="Child Group" style="max-height:85vh;overflow: scroll;" width="90%"
            align-center>
            <div class="loop-word-item" v-for="group in childGroupList" :key="group._id">
                <div class="loop-word-left">
                    <div class="loop-word-left-top">{{ group.name }}</div>
                    <div class="loop-word-left-bottom">{{ group.wordCount }} words</div>
                </div>
                <div class="loop-word-right">
                    <div class="loop-word-right-left">
                        <button @click.stop="handleClick('setting', group._id)">
                            <span>Settings</span>
                        </button>
                        <button @click.stop="handleClick('delete', group._id)">
                            <span>Delete</span>
                        </button>
                    </div>
                    <div class="loop-word-right-right">
                        <button @click.stop="handleClick('manage', group._id)">
                            <span>Words</span>
                        </button>
                        <button @click.stop="handleClick('cycling', group._id)">
                            <span>Cycling</span>
                        </button>
                    </div>

                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { request } from '@/utils/service';
import { ElNotification } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

// #region variable
let groupDialog = ref(false)
const form = ref({ name: '' })
const router = useRouter()
let groupList = ref([])
let childGroupList = ref([])
let currentClickedParentGroup = ref('')
// #endregion

// #region lifecycle
onMounted(async () => {
    getGroupList()
})
// #endregion

// #region function
async function handleClickGroupItem(item) {
    currentClickedParentGroup.value = item
    childGroupList.value = await getChildGroup(item._id)
    if (childGroupList.value.length > 0) { groupDialog.value = true }
    else {
        ElNotification({ type: 'info', message: 'No child', duration: 800 })
    }
}
async function getChildGroup(id) {
    let info = await request({ url: '/wordgroup/children', data: { parentGroupID: id }, method: 'post' })
    return info.data
}
async function handleClick(type, id) {
    switch (type) {
        case 'delete':
            const info = await request({
                url: '/wordgroup', method: 'delete', data: {
                    id: id
                }
            })

            if (info.code === 200) {
                getGroupList()
                childGroupList.value = await getChildGroup(currentClickedParentGroup.value._id)
            }
            break;
        case 'setting':
            router.push('/group/setting/' + id)
            break;
        case 'manage':
            router.push('/wordlist/' + id)
            break;
        case 'cycling':
            router.push('/recite/group?groupID=' + id)
            break;
        default:
            ElNotification({ message: 'Not support yet', type: 'warning', duration: 1200 })
            break;
    }

}
async function getGroupList() {
    const info = await request({
        url: '/wordgroup'
    })
    let agg = info.data.aggregate
    groupList.value = info.data.list.map(item => { item['childCount'] = agg[item._id]; return item })
}
async function createGroup() {
    if (form.value.name) {
        let m = await request({
            url: '/wordgroup', method: 'post', data: {
                name: form.value.name
            }
        })
        form.value.name = ''
        getGroupList()
    } else {
        ElNotification({ type: 'warning', message: 'Input group name.', duration: 1000 })
    }

}

function handleGoBack() {
    router.push('/home')
}
// #endregion
</script>

<style scoped lang="less">
.group-manage-container {
    width: 90%;
    margin: 0 auto 40px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;

    .loop-word-item {
        min-height: 65px;
        border: 1px solid #eeeeee;
        box-shadow: 2px 2px 2px #eeeeee;
        width: 100%;
        border-radius: 5px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 5px;

        .loop-word-left {
            width: 45%;
            height: 100%;
            font-size: 14px;

            .loop-word-left-top {
                height: 60%;
                color: #333;
            }

            .loop-word-left-bottom {
                height: 40%;
                color: grey;
            }
        }

        .loop-word-right {
            width: 160px;
            height: 100%;
            line-height: 60px;
            text-align: center;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;

            &-left,
            &-right {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                height: 100%;

                button {
                    margin: 0;
                    background-color: #eeeeee;
                    padding: 3px 5px;
                    border-radius: 3px;
                    width: 70px;
                }

                span {
                    background: linear-gradient(to right, red, blue);
                    color: transparent;
                    background-clip: text;
                    -webkit-background-clip: text;
                }
            }



        }
    }

    .group-manage-bottom-btn {
        position: fixed;
        bottom: 20px;
        text-align: center;
        width: 100%;
        // background-color: white;

    }
}
</style>
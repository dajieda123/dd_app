<template>
    <div>
        <van-tabs id="container" color="rgb(44,208,121)" title-active-color="rgb(44,208,121)"
                  title-inactive-color="#010101" v-model="active">
            <van-tab title="表单">

                <div class="van-cell-container">
                    <van-cell-group class="van-cell-margin">
                        <van-cell center title="填表时间" value="2019-10-11 15:15:50"/>
                        <van-cell class="admin-btn" title="申请人" value="林育加"/>
                        <van-cell title="请假类型" value="调休"/>
                    </van-cell-group>


                    <van-cell-group class="van-cell-margin">
                        <van-cell class="leave" title="请假详情1"/>
                        <van-cell title="日期" value="2019/10/11"/>
                        <van-cell title="时段" value="8:30-15:30"/>
                        <van-cell title="时常(h)" value="5"/>
                    </van-cell-group>


                    <van-cell-group class="van-cell-margin">
                        <van-cell class="leave" title="请假详情2"/>
                        <van-cell title="日期" value="2019/10-11 15:15:50"/>
                        <van-cell title="时段" value="全天"/>
                        <van-cell title="时常(h)" value="21"/>
                    </van-cell-group>


                    <van-cell-group class="van-cell-margin">
                        <van-cell title="合计天数" value="6"/>
                        <van-cell title="请假事由" value="春节加班调休"/>
                        <van-cell title="上传证明" value=""/>
                    </van-cell-group>
                </div>


            </van-tab>
            <van-tab title="动态">内容 2</van-tab>
            <van-tab class="last-tab" title="流转图">内容 3</van-tab>
            <van-tab disabled></van-tab>

        </van-tabs>

    </div>
</template>

<script>
    import Vue from 'vue';
    import {Tab, Tabs} from 'vant';
    import {Cell, CellGroup} from 'vant';

    Vue.use(Cell).use(CellGroup);
    Vue.use(Tab).use(Tabs);


    export default {
        data() {
            return {
                active: 0
            };
        },


        methods: {
            onLoad() {
                // 异步更新数据
                setTimeout(() => {
                    for (let i = 0; i < 10; i++) {
                        this.list.push(this.list.length + 1);
                    }
                    // 加载状态结束
                    this.loading = false;

                    // 数据全部加载完成
                    if (this.list.length >= 40) {
                        this.finished = true;
                    }
                }, 500);
            }
        }
    }


</script>

<style lang="less" scoped>

    .van-cell-margin {
        margin-top: 0.04rem;
        border-radius: 7px;

        /deep/ .van-cell {
            color: #656565;
        }

        /deep/ .van-cell__value {
            color: #010101;

        }
    }

    .leave {
        padding: 2px 16px;

        /deep/ .van-cell__title {
            font-size: 0.1rem;
            color: #010101;

        }
    }

    .van-cell-container {
        margin: 0rem 0.06rem 0.05rem 0.06rem;

        /deep/ .van-cell {
            border-radius: 10px;
        }
    }

    .admin-btn{
       /deep/ .van-cell__value span{
           background: #faf9fe;
           border: 1px solid #f3f3f3;
           border-radius: 16px;
           padding: 5px 11px;
        }
    }


</style>

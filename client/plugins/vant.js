import Vue from 'vue'
import { Toast, Loading, Icon, Cell, Slider, Tabbar, TabbarItem, Area, Overlay, DatetimePicker, Tab, Tabs, RadioGroup, Radio, Skeleton  } from 'vant'
import '../assets/css/theme.less'
export default ({ app }, inject) => {
    Toast.setDefaultOptions({
        className: 'ciboToast',
        duration: 2000,
        forbidClick: true
    })
    Vue.use(Toast);
    Vue.use(Loading);
    Vue.use(Icon);
    Vue.use(Cell);
    Vue.use(Slider);
    Vue.use(Tabbar);
    Vue.use(TabbarItem);
    Vue.use(Area);
    Vue.use(Overlay);
    Vue.use(DatetimePicker);
    Vue.use(Tab);
    Vue.use(Tabs);
    Vue.use(RadioGroup);
    Vue.use(Radio);
    Vue.use(Skeleton);
    inject('toast', Toast);
    inject('Icon', Icon);
}
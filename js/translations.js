/**
 * INSPINIA - Responsive Admin Theme
 *
 */
function config($translateProvider) {
    $translateProvider
        .translations('en', {
            // Define all menu elements
            LANGUAGE:'Language',
            LOGOUT:'Logout',
            DASHBOARD: 'Dashboard',
            GRAPHS: 'Graphs',
            MAILBOX: 'Mailbox',
            WIDGETS: 'Widgets',
            METRICS: 'Metrics',
            FORMS: 'Forms',
            APPVIEWS: 'App views',
            OTHERPAGES: 'Other pages',
            UIELEMENTS: 'UI elements',
            MISCELLANEOUS: 'Miscellaneous',
            GRIDOPTIONS: 'Grid options',
            TABLES: 'Tables',
            COMMERCE: 'E-commerce',
            GALLERY: 'Gallery',
            MENULEVELS: 'Menu levels',
            ANIMATIONS: 'Animations',
            LANDING: 'Landing page',
            LAYOUTS: 'Layouts',
            // Define some custom text
            WELCOME: 'Welcome Amelia',
            MESSAGEINFO: 'You have 42 messages and 6 notifications.',
            SEARCH: 'Search for something...',
            DEMO: 'Internationalization (sometimes shortened to \"I18N , meaning \"I - eighteen letters -N\") is the process of planning and implementing products and services so that they can easily be adapted to specific local languages and cultures, a process called localization . The internationalization process is sometimes called translation or localization enablement .'
        })
        .translations('es', {
            // Define all menu elements
            LANGUAGE:'Idioma',
            LOGOUT:'Salir',
            DASHBOARD: 'Salpicadero',
            GRAPHS: 'Gráficos',
            MAILBOX: 'El correo',
            WIDGETS: 'Widgets',
            METRICS: 'Métrica',
            FORMS: 'Formas',
            APPVIEWS: 'Vistas app',
            OTHERPAGES: 'Otras páginas',
            UIELEMENTS: 'UI elements',
            MISCELLANEOUS: 'Misceláneo',
            GRIDOPTIONS: 'Cuadrícula',
            TABLES: 'Tablas',
            COMMERCE: 'E-comercio',
            GALLERY: 'Galería',
            MENULEVELS: 'Niveles de menú',
            ANIMATIONS: 'Animaciones',
            LANDING: 'Página de destino',
            LAYOUTS: 'Esquemas',
            // Define some custom text
            WELCOME: 'Bienvenido Amelia',
            MESSAGEINFO: 'Usted tiene 42 mensajes y 6 notificaciones.',
            SEARCH: 'Busca algo ...',
            DEMO: 'Internacionalización (a veces abreviado como \"I18N, que significa\" I - dieciocho letras N \") es el proceso de planificación e implementación de productos y servicios de manera que se pueden adaptar fácilmente a las lenguas y culturas locales específicas, un proceso llamado localización El proceso de internacionalización. a veces se llama la traducción o la habilitación de localización.'
        })
        .translations('zh', {
            // Define all menu elements
            LANGUAGE:'语言',
            LOGOUT:'注销',
            AUTH:'权限管理',
            AUTH_DEPARTMENT:'部门管理',
            AUTH_STUFF:'人员管理',
            AUTH_ROLE:'角色管理',
            AUTH_USER:'用户管理',
            DASHBOARD: '主页',
            GRAPHS: '图表',
            MAILBOX: '邮箱',
            WIDGETS: '组件',
            METRICS: '指标',
            FORMS: '表单',
            APPVIEWS: 'App视图',
            OTHERPAGES: '其他页面',
            UIELEMENTS: 'UI元素',
            MISCELLANEOUS: '混合项',
            GRIDOPTIONS: 'Cuadrícula',
            TABLES: '表格',
            COMMERCE: 'E-comercio',
            GALLERY: '壁纸',
            MENULEVELS: '菜单层级',
            ANIMATIONS: '动画',
            LANDING: '登陆',
            LAYOUTS: '排列',
            // Define some custom text
            WELCOME: '欢迎登录！',
            MESSAGEINFO: '您有42条消息和1条提醒',
            SEARCH: '查询···',
            DEMO: 'Internacionalización (a veces abreviado como \"I18N, que significa\" I - dieciocho letras N \") es el proceso de planificación e implementación de productos y servicios de manera que se pueden adaptar fácilmente a las lenguas y culturas locales específicas, un proceso llamado localización El proceso de internacionalización. a veces se llama la traducción o la habilitación de localización.'
        });
    $translateProvider.preferredLanguage('zh');
}
angular
    .module('inspinia')
    .config(config);

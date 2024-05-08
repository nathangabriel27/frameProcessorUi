const colors = {
    primary: '#578EBE',
    primary_Dark: '#1C4265',
    primary_light: '#58AAFF',

    secundary: '#3276B5',
    secundary_light: '#5589B6',
    secundary_default: '#36ABD9',

    blue: '#DEE6F9',
    blue_light: '#04C8D2',

    gray: '#ADB5BD',
    gray_light: '#ededf0',
    ice: '#F5F5F5',
    shape: '#FFFFFF',
    shapeOpacity: 'rgba(255, 255, 255, 0.4)',

    warn: '#cf1b1b',
    rose: '#F26875',

    progres: '#2F189C',

    yellow: '#F5D37C',

    success: '#00875A',
    success_light: 'rgba(18, 164, 84, 0.2)',

    warn_light: 'rgba(232, 63, 91, 0.2)',

    black: '#000000',
    blackSecond: '#141414',
    blackOpacity: 'rgba(0, 0, 0, 0.7)',

    background: '#F3F9FB',

    title: '#25282B',
    text: '#657787',
    text_light: '#ADB5BD',
};

const sizes = {
    //Global Default Sizes
    small: 4,
    medium: 10,
    large: 14,
    maxSize: 20,

    title: 16,
    subTitle: 14,
    text: 12,

    /*   maxTitle: 26,
  superTitle: 30, */
};
const shadowStyle = {
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 3,
}
const shadowLowStyle = {
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.27,
    shadowRadius: 1.65,
    elevation: 1,
}

export {  colors, sizes, shadowStyle, shadowLowStyle };

export const customOptions = (duration = 300, fill = 'forwards') => ({
    fill,
    duration
});

export const options = {
    fill: 'forwards',
    duration: 300
}

export const fadeIn = [{
    opacity: 1
}];

export const fadeOut = [{
    opacity: 0
}];

export const fadeInBottom = [{
    opacity: 1,
    transform: 'translateY(0px)'
}];

export const fadeOutBottom = [{
    opacity: 0,
    transform: 'translateY(4px)'
}];

export const animate = async (element, keyframes, options) => await element.animate(keyframes, options).finished;
import apps from '../apps/*';

const Apps = Object.values(apps).sort((a, b) => a.name.localeCompare(b.name));

export default Apps;
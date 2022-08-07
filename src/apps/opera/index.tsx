import { Instance } from '../../redux/instances';
import { default as manifest } from './index.json';

class Opera {
    constructor(public app) {
    }

    render(instance: Instance) {
        return (
            <div>
                opera? {instance.id}
            </div>
        );
    }
}

export default {
    manifest,
    class: Opera
};

<script lang="ts">
    import '@fortawesome/fontawesome-free/css/fontawesome.css';
    import '@fortawesome/fontawesome-free/css/brands.css';
    import '@fortawesome/fontawesome-free/css/solid.css';

    export let name: string = 'font-awesome';
    export let type: string = 'brands';
</script>

<i class="fa-{type} fa-{name} fa-fw"></i>

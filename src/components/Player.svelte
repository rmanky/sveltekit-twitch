<script>
    import { onMount } from "svelte/internal";

    let mediaURL = "";
    let Player, Ui, Hls;

    onMount(async () => {
        const module = await import("@vime/svelte");
        ({ Player, Ui, Hls } = module);

        const response = await fetch("/media");
		const data = await response.json();
        ({ mediaURL } = data);
    });

    const config = {
        liveDurationInfinity: true,
    };
</script>

<div>
    {#if Player}
        <Player controls>
            <Hls version="latest" {config}>
                <source
                    data-src="{mediaURL}/live/rmanky/index.m3u8"
                    type="application/x-mpegURL"
                />
            </Hls>
            <Ui />
        </Player>
    {/if}
</div>

<style>
</style>

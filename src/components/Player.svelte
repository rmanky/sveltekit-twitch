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
        enableWorker: true,
        maxBufferLength: 1,
        liveBackBufferLength: 0,
        liveSyncDuration: 0,
        liveMaxLatencyDuration: 5,
        liveDurationInfinity: true,
        highBufferWatchdogPeriod: 1,
    };
</script>

<div>
    {#if Player}
        <Player controls>
            <Hls version="latest" {config}>
                <source
                    data-src="{mediaURL}/live/svelte/index.m3u8"
                    type="application/x-mpegURL"
                />
            </Hls>
            <Ui />
        </Player>
    {/if}
</div>

<style>
</style>

<script>
	import Chat from "$components/Chat.svelte";
	import Player from "$components/Player.svelte";
</script>

<main class="columns is-gapless mb-0 has-background-black">
	<div class="player column">
		<Player />
	</div>
	<div class="chat column is-narrow">
		<Chat />
	</div>
</main>

<style>
	.columns {
		height: 100vh;
		display: flex;
	}

	.player {
		flex: 1 1 auto;
    	align-self: center;
	}

	.chat {
		width: 350px;
		flex: 0 1 auto;
		display: flex;
		flex-direction: column;
		background: #111111;
	}
</style>

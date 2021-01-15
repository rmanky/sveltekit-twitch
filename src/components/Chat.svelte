<script lang="ts">
	import { onMount } from "svelte/internal";

	let hue;

	let username = "";
	let message = "";

	let messageHistory = [];
	let messages = [];

	let socket;

	let socketURL = "";

	onMount(async () => {
		username =
			window.localStorage.getItem("user") ||
			`Guest #${Math.random().toString().substr(2, 4)}`;
		hue =
			window.localStorage.getItem("hue") ||
			Math.floor(Math.random() * 255);
		window.localStorage.setItem("user", username);
		window.localStorage.setItem("hue", hue);

		console.log(username);

		const { io } = await import(
			// @ts-ignore
			"https://cdn.skypack.dev/socket.io-client/dist/socket.io.js"
		);

		const socketResponse = await fetch("/socket");
		const socketData = await socketResponse.json();
		const { socketURL } = socketData;

		socket = io(socketURL);

		const emoteResponse = await fetch("/emotes");
		const emoteList = await emoteResponse.json();

		socket.on("chat", async (payload) => {
			let arr = payload.msg.split(" ");
			let temp = [];
			arr.forEach((word) => {
				let emote = emoteList.filter((data) => data.code === word)[0];
				if (emote) {
					temp.push({
						txt: emote.img,
						img: true,
					});
				} else {
					temp.push({
						txt: `${word} `,
						img: false,
					});
				}
			});
			payload.msg = temp;
			messages = [...messages, payload];
		});
	});

	function sendMessage() {
		if (message && socket) {
			socket.emit("chat", { user: username, msg: message, hue: hue });
			console.log(message);
			messageHistory.push(message);
			message = "";
		}
	}

	function handleInput(event) {
		if (event.key === "ArrowUp") {
			message = messageHistory.pop() || message;
		} else if (event.key === "Enter") {
			sendMessage();
		}
	}
</script>

<div class="notification is-link m-2 is-size-4">Ain't it cool? 😎</div>
<div id="messages" class="mr-2">
	<div>
		{#each messages as { user, msg, hue }}
			<p class="msg p-2">
				<span style="color: hsl({hue},90%,75%)">{user}:</span>
				{#each msg as { txt, img }}
					{#if img}
						<img alt="test" src={txt} />
					{:else}
						{txt}
					{/if}
				{/each}
			</p>
		{/each}
	</div>
</div>
<div id="input" class="field p-2">
	<div class="control">
		<input
			bind:value={message}
			on:keyup={handleInput}
			class="input"
			type="text"
			placeholder="Type a message, then press Enter!"
		/>
	</div>
</div>

<style>
	#input {
		margin-top: auto;
	}

	#messages {
		overflow-y: auto;
		overflow-x: hidden;
	}

	#messages::-webkit-scrollbar {
		width: 10px;
	}

	#messages::-webkit-scrollbar-track {
		background: none;
	}

	#messages::-webkit-scrollbar-thumb {
		background-color: #323232;
		border-radius: 5px;
	}

	.msg {
		word-wrap: break-word;
	}

	.msg:nth-child(even) {
		background-color: rgba(0, 0, 0, 0.1);
	}

	p {
		line-height: 2;
	}

	img {
		vertical-align: middle;
		display: inline;
		margin-bottom: 0.25rem;
		margin-right: 0.25rem;
	}
</style>

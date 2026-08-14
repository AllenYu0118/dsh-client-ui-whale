/**
 * Token-meter whale — browser half (hand-built client bundle).
 *
 * Registers a floating DeepSeek-logo whale into the conversation session
 * header actions slot, portals it to <body> just right of the conversation
 * column, and drives the water spout from the live `tokenUsage` projection.
 */
window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-client-ui-whale",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		var React = require("react");
		var ReactDom = require("react-dom");

		/* ------------------------------------------------------------------ *
		 * Styles (injected once, idempotent, like the tsdown CSS convention)
		 * ------------------------------------------------------------------ */
		var css = [
			".whale-root{position:fixed;bottom:24px;z-index:1000;pointer-events:none;display:flex;flex-direction:column;align-items:center}",
			".whale-stage{position:relative;width:56px;height:56px}",
			".whale-svg{position:absolute;inset:0;display:block;filter:drop-shadow(0 2px 6px rgba(77,107,254,.45));animation:whale-bob 3s ease-in-out infinite}",
			".whale-spray{position:absolute;width:0;height:0}",
			".whale-drop{position:absolute;bottom:0;left:0;border-radius:50%;background:#4d6bfe;opacity:0;animation-name:whale-spray;animation-timing-function:ease-out;animation-iteration-count:infinite}",
			"@keyframes whale-spray{0%{transform:translate(0,0) scale(.5);opacity:0}15%{opacity:.95}100%{transform:translate(var(--dx,0px),calc(-1 * var(--h,40px))) scale(1);opacity:0}}",
			"@keyframes whale-bob{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-3px) rotate(1deg)}}",
			".whale-count{margin-top:1px;font:11px/1.4 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#4d6bfe;background:rgba(255,255,255,.85);border:1px solid rgba(77,107,254,.3);border-radius:999px;padding:1px 7px;box-shadow:0 1px 3px rgba(0,0,0,.08)}",
			"@media (prefers-color-scheme: dark){.whale-count{color:#a5b4fc;background:rgba(11,18,32,.75);border-color:rgba(77,107,254,.4)}}"
		].join("");
		var tagId = "@deepseek-ai/dsh-client-ui-whale/whale.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			var tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-whale";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}

		/* ------------------------------------------------------------------ *
		 * DeepSeek whale logo path (viewBox 0 0 50 50), from the shipped
		 * favicon.svg, filled with the brand blue.
		 * ------------------------------------------------------------------ */
		var WHALE_PATH = "M48.8354 10.0479C48.3232 9.79199 48.1025 10.2798 47.8032 10.5278C47.7007 10.6079 47.6143 10.7119 47.5273 10.8076C46.7793 11.624 45.9048 12.1597 44.7622 12.0957C43.0923 12 41.666 12.5356 40.4058 13.8398C40.1377 12.2319 39.2476 11.272 37.8926 10.6558C37.1836 10.3359 36.4668 10.0156 35.9702 9.31982C35.6235 8.82373 35.5293 8.27197 35.356 7.72754C35.2456 7.3999 35.1353 7.06396 34.7651 7.00781C34.3633 6.94385 34.2056 7.2876 34.0479 7.57568C33.418 8.75195 33.1733 10.0479 33.1973 11.3599C33.2524 14.312 34.4736 16.6641 36.8999 18.3359C37.1758 18.5278 37.2466 18.7197 37.1597 19C36.9946 19.5757 36.7974 20.1357 36.624 20.7119C36.5137 21.0801 36.3486 21.1597 35.9624 21C34.6309 20.4321 33.481 19.5918 32.4644 18.5757C30.7393 16.8721 29.1792 14.9917 27.2334 13.52C26.7764 13.1758 26.3193 12.856 25.8467 12.5518C23.8618 10.584 26.1069 8.96777 26.627 8.77588C27.1704 8.57568 26.8159 7.8877 25.0591 7.896C23.3022 7.90381 21.6953 8.50391 19.647 9.30371C19.3477 9.42383 19.0322 9.51172 18.7095 9.58398C16.8501 9.22363 14.9199 9.14355 12.9033 9.37598C9.10596 9.80762 6.07275 11.6396 3.84326 14.7681C1.16455 18.5278 0.53418 22.7998 1.30664 27.2559C2.11768 31.9521 4.46582 35.8398 8.07373 38.8799C11.8159 42.0322 16.1255 43.5762 21.041 43.2803C24.0269 43.104 27.3516 42.6963 31.1016 39.4561C32.0469 39.936 33.0396 40.1279 34.686 40.272C35.9546 40.3921 37.1758 40.208 38.1211 40.0078C39.6021 39.688 39.4995 38.2881 38.9639 38.0322C34.623 35.9678 35.5762 36.8081 34.71 36.1279C36.9155 33.4639 40.2402 30.6958 41.54 21.728C41.6426 21.0161 41.5557 20.5679 41.54 19.9917C41.5322 19.6396 41.6108 19.5039 42.0049 19.4639C43.0923 19.3359 44.1479 19.0317 45.1167 18.4878C47.9292 16.9199 49.064 14.3438 49.3315 11.2559C49.3711 10.7837 49.3237 10.2959 48.8354 10.0479ZM24.3262 37.8398C20.1196 34.4639 18.0791 33.3521 17.2358 33.3999C16.4482 33.4482 16.5898 34.3682 16.7632 34.9678C16.9443 35.5601 17.1812 35.9683 17.5117 36.4878C17.7402 36.832 17.8979 37.3442 17.2832 37.728C15.9282 38.584 13.5728 37.4399 13.4624 37.3838C10.7207 35.7358 8.42822 33.5601 6.81348 30.584C5.25342 27.7197 4.34766 24.6479 4.19775 21.3677C4.1582 20.5757 4.38672 20.2959 5.15869 20.1519C6.17529 19.96 7.22314 19.9199 8.23926 20.0718C12.5327 20.7119 16.1885 22.6719 19.2529 25.7759C21.002 27.5439 22.3252 29.6558 23.6885 31.7202C25.1377 33.9121 26.6978 36 28.6831 37.7119C29.3843 38.312 29.9434 38.7681 30.479 39.104C28.8643 39.2881 26.1699 39.3281 24.3262 37.8398ZM26.3433 24.6001C26.3433 24.248 26.6191 23.9678 26.9658 23.9678C27.0444 23.9678 27.1152 23.9839 27.1782 24.0078C27.2651 24.04 27.3438 24.0879 27.4067 24.1602C27.5171 24.272 27.5801 24.4321 27.5801 24.6001C27.5801 24.9521 27.3042 25.2319 26.9575 25.2319C26.6108 25.2319 26.3433 24.9521 26.3433 24.6001ZM32.6064 27.8799C32.2046 28.0479 31.8027 28.1919 31.4165 28.208C30.8179 28.2397 30.1641 27.9922 29.8096 27.688C29.2583 27.2158 28.8643 26.9521 28.6987 26.1279C28.6279 25.7759 28.6675 25.2319 28.7305 24.9199C28.8721 24.248 28.7144 23.8159 28.2495 23.4238C27.8716 23.104 27.3911 23.0161 26.8633 23.0161C26.666 23.0161 26.4849 22.9277 26.3511 22.856C26.1304 22.7441 25.9492 22.4639 26.1226 22.1201C26.1777 22.0078 26.4458 21.7358 26.5088 21.688C27.2256 21.272 28.0527 21.4077 28.8169 21.7197C29.5259 22.0161 30.0615 22.5601 30.834 23.3281C31.6216 24.2559 31.7632 24.5117 32.2124 25.208C32.5669 25.752 32.8901 26.312 33.1104 26.9521C33.2446 27.3521 33.0713 27.6802 32.6064 27.8799Z";

		/* Blowhole anchor inside the 56px stage, scaled from viewBox (36,7)/50. */
		var BLOWHOLE_X = 40;
		var BLOWHOLE_Y = 8;

		function formatTokens(n) {
			if (n < 1000) return String(n);
			if (n < 1000000) {
				return n < 10000 ? (n / 1000).toFixed(1) + "K" : Math.round(n / 1000) + "K";
			}
			return (n / 1000000).toFixed(1) + "M";
		}

		/**
		 * Pin the whale to the right edge of the conversation column
		 * (`[class*="_centerCol"]` in the shipped layout), falling back to the
		 * viewport corner when the column is absent or has no room to its right.
		 * Returns { left, right } with exactly one side set, for position: fixed.
		 */
		function useWhalePosition() {
			var state = React.useState({ left: undefined, right: 28 });
			var pos = state[0];
			var setPos = state[1];
			React.useLayoutEffect(function () {
				function measure() {
					var col = document.querySelector('[class*="_centerCol"]');
					if (!col) {
						setPos({ left: undefined, right: 28 });
						return;
					}
					var rect = col.getBoundingClientRect();
					var left = Math.round(rect.right + 16);
					/* 96px reserved width keeps the whale fully on-screen. */
					if (left + 96 <= window.innerWidth - 8) {
						setPos({ left: left, right: undefined });
					} else {
						setPos({ left: undefined, right: 12 });
					}
				}
				measure();
				window.addEventListener("resize", measure);
				var col = document.querySelector('[class*="_centerCol"]');
				var ro = col && typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
				if (ro) ro.observe(col);
				return function () {
					window.removeEventListener("resize", measure);
					if (ro) ro.disconnect();
				};
			}, []);
			return pos;
		}

		/**
		 * The floating whale. Receives the session-scope standard kit
		 * (`useProjection` among others) from the slot host, reads the live
		 * tokenUsage projection, and portals itself to <body> so fixed
		 * positioning is viewport-relative regardless of the conversation
		 * layout transforms.
		 */
		function TokenWhale(props) {
			var useProjection = props.useProjection;
			if (typeof useProjection !== "function") return null;

			var pos = useWhalePosition();
			var usage = useProjection("tokenUsage");
			var total = usage
				? usage.uncachedInputTokens + usage.outputTokens + usage.cacheReadTokens + usage.cacheWriteTokens
				: 0;

			/* Sub-linear curve: visible early growth, saturating near ~150K tokens. */
			var level = total <= 0 ? 0 : Math.min(1, Math.pow(total / 150000, 0.4));
			var spoutH = level <= 0 ? 0 : Math.round(8 + level * 72);
			var dropCount = level <= 0 ? 0 : 2 + Math.round(level * 4);
			var dropSize = 3 + Math.round(level * 3);

			var drops = [];
			for (var i = 0; i < dropCount; i++) {
				drops.push({
					dx: Math.round((i - (dropCount - 1) / 2) * 6),
					delay: (i * 0.26).toFixed(2),
					dur: (0.95 + (i % 3) * 0.2).toFixed(2)
				});
			}

			var whale = React.createElement(
				React.Fragment,
				null,
				React.createElement(
					"div",
					{ className: "whale-stage" },
					React.createElement(
						"svg",
						{ className: "whale-svg", width: 56, height: 56, viewBox: "0 0 50 50", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true" },
						React.createElement("path", { d: WHALE_PATH, fill: "#4D6BFE", fillRule: "nonzero" })
					),
					React.createElement(
						"div",
						{ className: "whale-spray", style: { left: BLOWHOLE_X, top: BLOWHOLE_Y } },
						drops.map(function (d, i) {
							return React.createElement("i", {
								key: i,
								className: "whale-drop",
								style: {
									"--h": spoutH + "px",
									"--dx": d.dx + "px",
									width: dropSize + "px",
									height: dropSize + "px",
									animationDelay: d.delay + "s",
									animationDuration: d.dur + "s"
								}
							});
						})
					)
				),
				React.createElement("div", { className: "whale-count" }, formatTokens(total) + " tok")
			);

			return ReactDom.createPortal(
				React.createElement(
					"div",
					{ className: "whale-root", "aria-hidden": "true", style: { left: pos.left, right: pos.right } },
					whale
				),
				document.body
			);
		}

		/* Client plugin: contributes one entry into the session header actions
		 * slot (list kind, session scope → standard kit carries useProjection). */
		exports.apply = function apply(ctx) {
			ctx.effect(function () {
				return ctx.slots.inject("conversation.session.header.actions", function () {
					return ctx.slots.register(
						{ name: "conversation.session.header.actions", id: "token-whale", order: 40 },
						TokenWhale
					);
				});
			}, "ui-whale: token whale");
		};
		exports.inject = ["slots"];

		return module.exports;
	}
});

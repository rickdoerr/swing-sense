<script lang="ts">
    /**
     * rotation-dial.svelte
     * Visualizes shoulder and hip layout.
     *
     * variants:
     * - "address": Railroad Track view. Shows Shoulder vs Feet alignment.
     *              Feet are static horizontal reference. Shoulders rotate.
     *              Green glow if within 3 degrees. Red arc if misaligned.
     *
     * - "top":     X-Factor view.
     *              Oriented so Target Line (Feet) is Horizontal (90deg).
     *              Feet: White, Horizontal.
     *              Hip: Blue.
     *              Shoulder: Green/Yellow.
     *              Ideal Gap: Light Orange (Hip to Hip + 45).
     *              User Gap: Logic-based color (Hip to Shoulder).
     */

    let {
        shoulderAngle = 0,
        hipAngle = 0,
        variant = "address",
    }: {
        shoulderAngle?: number;
        hipAngle?: number;
        variant?: "address" | "top" | "loading";
    } = $props();

    const SIZE = 200;
    const CENTER = SIZE / 2;
    const RADIUS = SIZE * 0.45;

    // --- UTILS ---

    function toRad(deg: number) {
        return (deg - 90) * (Math.PI / 180);
    }

    // Calculate line endpoint
    function getEndPoint(
        angleDeg: number,
        length: number = RADIUS,
        offsetX = 0,
        offsetY = 0,
    ) {
        const r = toRad(angleDeg);
        return {
            x: CENTER + offsetX + length * Math.cos(r),
            y: CENTER + offsetY + length * Math.sin(r),
        };
    }

    // ARC generator
    function describeArc(
        x: number,
        y: number,
        radius: number,
        startAngle: number,
        endAngle: number,
    ) {
        const start = getEndPoint(endAngle, radius, x - CENTER, y - CENTER);
        const end = getEndPoint(startAngle, radius, x - CENTER, y - CENTER);

        let diff = endAngle - startAngle;
        while (diff < 0) diff += 360;
        while (diff > 360) diff -= 360;

        const largeArcFlag = diff > 180 ? "1" : "0";

        return [
            "M",
            x,
            y,
            "L",
            start.x,
            start.y,
            "A",
            radius,
            radius,
            0,
            largeArcFlag,
            0,
            end.x,
            end.y,
            "L",
            x,
            y,
        ].join(" ");
    }

    // --- TOP VARIANT LOGIC ---

    // Top Variant: Feet at 90 deg (Horizontal) to match Address view
    const feetAngleTop = 90;

    // X-Factor Calculation
    const xFactor = $derived(Math.abs(shoulderAngle - hipAngle));

    // Status & Colors
    const status = $derived.by(() => {
        if (variant === "address") {
            const aligned = Math.abs(shoulderAngle) <= 3;
            if (aligned)
                return {
                    label: "ALIGNED",
                    color: "#4ade80",
                    value: Math.abs(shoulderAngle),
                };
            return {
                label: "MISALIGNED",
                color: "#f87171",
                value: Math.abs(shoulderAngle),
            };
        }

        // Top logic
        if (xFactor > 40)
            return {
                label: "Excellent",
                color: "#4ade80",
                value: Math.round(xFactor),
            }; // Green
        if (xFactor >= 35)
            return {
                label: "Good",
                color: "#fb923c",
                value: Math.round(xFactor),
            }; // Orange
        return {
            label: "Improvement Needed",
            color: "#f87171",
            value: Math.round(xFactor),
        }; // Red
    });

    const wedgePath = $derived.by(() => {
        if (variant !== "top") return "";
        const start = Math.min(hipAngle, shoulderAngle);
        const end = Math.max(hipAngle, shoulderAngle);
        return describeArc(CENTER, CENTER, RADIUS, start, end);
    });

    const idealWedgePath = $derived.by(() => {
        if (variant !== "top") return "";
        // Ideal Range: Hip to Hip + 45 deg
        const diff = shoulderAngle - hipAngle;
        const direction = diff >= 0 ? 1 : -1;

        const start = Math.min(hipAngle, hipAngle + direction * 45);
        const end = Math.max(hipAngle, hipAngle + direction * 45);

        return describeArc(CENTER, CENTER, RADIUS * 1.1, start, end);
    });

    // Endpoints for Top View
    const feetStartTop = $derived(getEndPoint(feetAngleTop, RADIUS + 10));
    const feetEndTop = $derived(getEndPoint(feetAngleTop + 180, RADIUS * 0.2));

    const hipStartTop = $derived(getEndPoint(hipAngle, RADIUS));
    const hipEndTop = $derived(getEndPoint(hipAngle + 180, RADIUS * 0.2));

    const shoulderStartTop = $derived(getEndPoint(shoulderAngle, RADIUS));
    const shoulderEndTop = $derived(
        getEndPoint(shoulderAngle + 180, RADIUS * 0.2),
    );

    // --- ADDRESS VARIANT LOGIC (Railroad) ---
    const isAligned = $derived(Math.abs(shoulderAngle) <= 3);
    const feetAngleAddress = 90;
    const shoulderAngleAddress = $derived(90 + shoulderAngle);

    const feetStartAddr = $derived(getEndPoint(feetAngleAddress, RADIUS * 1.0));
    const feetEndAddr = $derived(
        getEndPoint(feetAngleAddress + 180, RADIUS * 1.0),
    );

    const shoulderStartAddr = $derived(
        getEndPoint(shoulderAngleAddress, RADIUS * 1.0),
    );
    const shoulderEndAddr = $derived(
        getEndPoint(shoulderAngleAddress + 180, RADIUS * 1.0),
    );

    const addressArcPath = $derived.by(() => {
        if (isAligned) return "";
        const start = Math.min(90, 90 + shoulderAngle);
        const end = Math.max(90, 90 + shoulderAngle);
        return describeArc(CENTER, CENTER, RADIUS * 0.5, start, end);
    });
</script>

<div
    class="relative w-full aspect-square max-w-[280px] mx-auto select-none font-sans flex flex-col items-center"
>
    <svg
        viewBox="0 0 {SIZE} {SIZE}"
        class="w-full h-full drop-shadow-lg"
        style="overflow: visible;"
    >
        <!-- Background Circle (Faint) -->
        <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="rgb(255,255,255)"
            stroke-opacity="0.1"
            stroke-width="1"
            stroke-dasharray="4 4"
        />

        {#if variant === "address"}
            <!-- === ADDRESS (RAILROAD) === -->

            <!-- Feet Line (Reference) - Horizontal -->
            <line
                x1={feetEndAddr.x}
                y1={feetEndAddr.y}
                x2={feetStartAddr.x}
                y2={feetStartAddr.y}
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-dasharray="4 2"
                opacity="0.8"
            />

            <!-- Shoulder Line - Rotated -->
            <line
                x1={shoulderEndAddr.x}
                y1={shoulderEndAddr.y}
                x2={shoulderStartAddr.x}
                y2={shoulderStartAddr.y}
                stroke={isAligned ? "#4ade80" : "#f87171"}
                stroke-width="4"
                stroke-linecap="round"
                class="transition-colors duration-300"
                class:filter-drop-shadow={isAligned}
                class:drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]={isAligned}
            />

            <!-- Misalignment Arc -->
            {#if !isAligned}
                <path
                    d={addressArcPath}
                    fill="rgba(248, 113, 113, 0.2)"
                    stroke="#f87171"
                    stroke-width="1"
                    stroke-dasharray="2 2"
                />
            {/if}
        {:else if variant === "top"}
            <!-- === TOP OF SWING (X-FACTOR) === -->

            <!-- Ideal Wedge (Light Orange) -->
            <path
                d={idealWedgePath}
                fill="#fb923c"
                fill-opacity="0.2"
                stroke="#fb923c"
                stroke-width="1"
                stroke-opacity="0.4"
                stroke-dasharray="2 2"
            />

            <!-- User Wedge (Status Color) -->
            <path
                d={wedgePath}
                fill={status.color}
                fill-opacity="0.5"
                stroke="none"
            />

            <!-- Feet Line (Target) - Horizontal Fixed White -->
            <line
                x1={CENTER}
                y1={CENTER}
                x2={feetStartTop.x}
                y2={feetStartTop.y}
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-dasharray="4 2"
                opacity="0.8"
            />
            <line
                x1={CENTER}
                y1={CENTER}
                x2={feetEndTop.x}
                y2={feetEndTop.y}
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                opacity="0.3"
            />

            <!-- Hip Line (Blue) -->
            <line
                x1={CENTER}
                y1={CENTER}
                x2={hipStartTop.x}
                y2={hipStartTop.y}
                stroke="#3b82f6"
                stroke-width="3"
                stroke-linecap="round"
            />
            <line
                x1={CENTER}
                y1={CENTER}
                x2={hipEndTop.x}
                y2={hipEndTop.y}
                stroke="#3b82f6"
                stroke-width="3"
                stroke-linecap="round"
                opacity="0.3"
            />

            <!-- Shoulder Line (Green/Yellow) -->
            <line
                x1={CENTER}
                y1={CENTER}
                x2={shoulderStartTop.x}
                y2={shoulderStartTop.y}
                stroke="#a3e635"
                stroke-width="4"
                stroke-linecap="round"
            />
            <line
                x1={CENTER}
                y1={CENTER}
                x2={shoulderEndTop.x}
                y2={shoulderEndTop.y}
                stroke="#a3e635"
                stroke-width="4"
                stroke-linecap="round"
                opacity="0.3"
            />
        {/if}

        {#if variant === "loading"}
            <!-- === LOADING SPINNER === -->
            <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke="#e2e8f0"
                stroke-width="4"
                stroke-opacity="0.1"
            />
            <path
                d={describeArc(CENTER, CENTER, RADIUS, 0, 90)}
                fill="none"
                stroke="#3b82f6"
                stroke-width="4"
                stroke-linecap="round"
            >
                <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 {CENTER} {CENTER}"
                    to="360 {CENTER} {CENTER}"
                    dur="1s"
                    repeatCount="indefinite"
                />
            </path>
            <!-- Pulse Effect in Center -->
            <circle cx={CENTER} cy={CENTER} r="6" fill="#3b82f6">
                <animate
                    attributeName="r"
                    values="6;10;6"
                    dur="2s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="opacity"
                    values="1;0.5;1"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </circle>
        {/if}

        <!-- Center Pivot (Standard) -->
        {#if variant !== "loading"}
            <circle
                cx={CENTER}
                cy={CENTER}
                r="3"
                fill="#e2e8f0"
                stroke="none"
            />
        {/if}
    </svg>

    <!-- UNIFIED LABELS SECTION -->
    {#if variant !== "loading"}
        <div class="mt-2 flex flex-col items-center gap-1 min-h-[60px] w-full">
            <div class="flex items-baseline gap-1.5">
                <span
                    class="text-xs text-theme-text-secondary font-bold tracking-wider uppercase"
                >
                    {variant === "address" ? "Deviation" : "X-Factor"}
                </span>
                <span class="text-xl font-black" style="color: {status.color}">
                    {status.value}°
                </span>
            </div>

            <div
                class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-white/5 border border-white/10"
                style="color: {status.color}"
            >
                {status.label}
            </div>

            <!-- Legend Dots -->
            <div
                class="flex gap-3 text-[9px] mt-2 uppercase font-bold tracking-wider text-theme-text-secondary"
            >
                {#if variant === "address"}
                    <div class="flex items-center gap-1">
                        <div
                            class="w-1.5 h-1.5 rounded-full bg-theme-text-secondary opacity-50"
                        ></div>
                        Feet
                    </div>
                    <div class="flex items-center gap-1">
                        <div
                            class="w-1.5 h-1.5 rounded-full"
                            style="background-color: {status.color}"
                        ></div>
                        Shoulders
                    </div>
                {:else}
                    <div class="flex items-center gap-1">
                        <div
                            class="w-1.5 h-1.5 rounded-full bg-theme-text-secondary opacity-50"
                        ></div>
                        Feet
                    </div>
                    <div class="flex items-center gap-1">
                        <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        Hip
                    </div>
                    <div class="flex items-center gap-1">
                        <div class="w-1.5 h-1.5 rounded-full bg-lime-400"></div>
                        Shoulders
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

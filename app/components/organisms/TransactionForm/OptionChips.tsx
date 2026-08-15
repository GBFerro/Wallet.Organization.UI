import { ThemedText } from "@components/atoms/ThemedText";
import { BorderRadius, Spacing } from "@constants/theme";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

export interface OptionChip<T> {
	value: T;
	label: string;
	icon?: keyof typeof Feather.glyphMap;
}

export interface OptionChipsProps<T> {
	options: OptionChip<T>[];
	selected: T;
	onSelect: (value: T) => void;
	layout?: "row" | "scroll" | "grid";
}

export function OptionChips<T extends string>({
	options,
	selected,
	onSelect,
	layout = "row",
}: Readonly<OptionChipsProps<T>>) {
	const { theme } = useTheme();

	const chips = options.map((option) => {
		const isSelected = option.value === selected;
		const foreground = isSelected ? "#FFFFFF" : theme.text;

		return (
			<Pressable
				key={option.value}
				accessibilityRole="button"
				accessibilityLabel={option.label}
				accessibilityState={{ selected: isSelected }}
				onPress={() => onSelect(option.value)}
				style={[
					layout === "grid" ? styles.gridChip : styles.chip,
					{
						backgroundColor: isSelected
							? theme.primary
							: theme.backgroundDefault,
						borderColor: isSelected ? theme.primary : theme.border,
					},
				]}
			>
				{option.icon ? (
					<Feather name={option.icon} size={20} color={foreground} />
				) : null}
				<ThemedText
					type="caption"
					numberOfLines={1}
					style={{ color: foreground }}
				>
					{option.label}
				</ThemedText>
			</Pressable>
		);
	});

	if (layout === "scroll") {
		return (
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.row}
			>
				{chips}
			</ScrollView>
		);
	}

	return (
		<View style={layout === "grid" ? styles.grid : styles.row}>{chips}</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		gap: Spacing.sm,
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: Spacing.sm,
	},
	chip: {
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.sm,
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.md,
		borderRadius: BorderRadius.sm,
		borderWidth: 1,
	},
	gridChip: {
		flexGrow: 1,
		flexBasis: "47%",
		flexDirection: "row",
		alignItems: "center",
		gap: Spacing.sm,
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.md,
		borderRadius: BorderRadius.sm,
		borderWidth: 1,
	},
});

import { View, StyleSheet, Alert } from "react-native";
import { formatter } from "../utils/formatter";
import { ExpenseItem } from "../utils/ExpenseItem";
import { Text, XStack, Button, PopoverProps, YStack, Adapt } from "tamagui";
import { Popover } from "tamagui";
import { IconDots } from "@tabler/icons-react-native";
import { useStore } from "../utils/useStore";
import { useState } from "react";

export default function ExpenseItemCard({
  item,
  onDelete,
}: {
  item: ExpenseItem;
  onDelete: () => void;
}) {
  const amount = formatter.format(item.amount);
  const date = new Date(item.created_at);
  return (
    <XStack flex={1} style={styles.item}>
      <View style={styles.titleAndAmount}>
        <Text>{item.title}</Text>
        <Text>{amount}</Text>
      </View>
      <View style={styles.categoryAndDate}>
        <Text>{item.category}</Text>
        <Text>
          {date.toLocaleDateString("en-us", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </Text>
      </View>
      <View style={styles.moreContainer}>
        <PopoverDisplay
          item={item}
          Icon={IconDots}
          onDelete={onDelete}
          Name="More"
        />
      </View>
    </XStack>
  );
}

export function PopoverDisplay({
  Icon,
  Name,
  item,
  onDelete,
  ...props
}: PopoverProps & {
  Icon: any;
  Name?: string;
  item: ExpenseItem;
  onDelete: () => void;
}) {
  const deleteExpense = useStore((state: any) => state.deleteExpense);
  const amount = formatter.format(item.amount);
  const date = new Date(item.created_at);

  const handleDelete = () => {
    Alert.alert(
      "Delete expense",
      "Are you sure you want to delete this expense?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteExpense(item.id);
            } catch (error) {
              console.log(error);
            } finally {
              onDelete();
            }
          },
          style: "destructive",
        },
      ]
    );
  };
  return (
    <Popover size="$1.5" allowFlip {...props}>
      <Popover.Trigger asChild>
        <Button icon={<IconDots />} />
      </Popover.Trigger>
      <Adapt when="sm" platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame padding="$4">
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Popover.Sheet>
      </Adapt>

      <Popover.Content
        borderWidth={1}
        borderColor="gray"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          "quick",
          {
            opacity: {
              overshootClamping: true,
              duration: 50,
            },
          },
        ]}
      >
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />
        <YStack>
          <View>
            <Text style={styles.titleHeader}>{item.title}</Text>
            <Text style={styles.amountHeader}>{amount}</Text>
          </View>
          <View>
            <Text>
              {date.toLocaleDateString("en-us", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
          <View style={styles.deleteButtonContainer}>
            <Popover.Close asChild>
              <Button
                size="$2"
                onPress={() => {
                  Alert.alert("edit expense");
                }}
                style={styles.deleteButton}
              >
                edit
              </Button>
            </Popover.Close>
            <Popover.Close asChild>
              <Button
                size="$2"
                onPress={() => {
                  handleDelete();
                }}
                style={styles.deleteButton}
              >
                delete
              </Button>
            </Popover.Close>
          </View>
        </YStack>
      </Popover.Content>
    </Popover>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#eee",
    padding: 10,
    marginVertical: 6,
  },
  titleHeader: {
    fontSize: 36,
    fontWeight: "bold",
  },
  amountHeader: {
    fontSize: 24,
    fontWeight: "semibold",
  },
  deleteButton: {
    minHeight: 45,
    minWidth: 160,
    fontWeight: "semibold",
    fontSize: 16,
    marginVertical: 4,
  },
  categoryAndDate: {
    alignItems: "flex-end",
    minWidth: 200,
    maxWidth: 300,
  },
  moreContainer: {
    marginLeft: 8,
    minWidth: 50,
  },
  titleAndAmount: {
    minWidth: 100,
    maxWidth: 125,
  },
  deleteButtonContainer: {
    marginTop: 64,
  },
});

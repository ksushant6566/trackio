"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { Edit3, Loader2, Plus, Trash2 } from "lucide-react";
import { goalTypeEnum } from "~/server/db/schema";
import { Checkbox } from "~/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

export const Goals: React.FC = () => {
  const { data: goals, isLoading, refetch } = api.goals.getAll.useQuery();
  const { mutate: createGoal, isPending: isCreatingGoal } =
    api.goals.create.useMutation({
      onSuccess: () => {
        refetch();
      },
    });
  const {
    mutate: updateGoal,
    isPending: isUpdatingGoal,
    variables: updateGoalVariables,
  } = api.goals.update.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const {
    mutate: deleteGoal,
    isPending: isDeletingGoal,
    variables: deleteGoalVariables,
  } = api.goals.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const [selectedGoalType, setSelectedGoalType] =
    useState<(typeof goalTypeEnum.enumValues)[number]>("daily");

  const onCreateGoal = () => {
    createGoal({
      title: "New Goal",
      description: "",
      priority: "medium",
      impact: "medium",
      category: "health",
      type: "one_time",
    });
  };

  const toggleGoalStatus = (goalId: string, checked: CheckedState) => {
    updateGoal({
      id: goalId,
      status: checked ? "completed" : "pending",
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    deleteGoal({ id: goalId });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-6xl font-thin">
            {new Date().toLocaleTimeString("en-IN", {
              minute: "numeric",
              hour: "numeric",
              hour12: false,
            })}
          </h1>
          <h1 className="text-xl font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h1>
        </div>

        {/* <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-medium">Goals</h1>
          </div>
        </div> */}

        <div className="flex flex-row-reverse justify-end gap-2">
          <Button
            size="sm"
            className="w-20 text-xs"
            variant={selectedGoalType === "yearly" ? "default" : "outline"}
            onClick={() => setSelectedGoalType("yearly")}
          >
            Yearly
          </Button>
          <Button
            size="sm"
            className="w-20 text-xs"
            variant={selectedGoalType === "monthly" ? "default" : "outline"}
            onClick={() => setSelectedGoalType("monthly")}
          >
            Monthly
          </Button>
          <Button
            size="sm"
            className="w-20 text-xs"
            variant={selectedGoalType === "weekly" ? "default" : "outline"}
            onClick={() => setSelectedGoalType("weekly")}
          >
            Weekly
          </Button>
          <Button
            size="sm"
            className="w-20 text-xs"
            variant={selectedGoalType === "daily" ? "default" : "outline"}
            onClick={() => setSelectedGoalType("daily")}
          >
            Daily
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 pr-4">
        {goals?.map((goal, i) => (
          <div key={goal.id} className="group flex justify-between gap-2 py-3">
            <div className="flex items-start gap-3">
              {isUpdatingGoal && goal.id === updateGoalVariables?.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Checkbox
                  id={goal.id}
                  className="h-4 w-4 rounded-full"
                  checked={goal.status === "completed"}
                  onCheckedChange={(checked) =>
                    toggleGoalStatus(goal.id, checked)
                  }
                />
              )}
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={goal.id}
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${goal.status === "completed" ? "line-through" : ""}`}
                >
                  {goal.title}
                </label>
                <p className="text-sm text-muted-foreground">
                  {goal.description}
                </p>
              </div>
            </div>
            <div className="flex -translate-y-6 gap-0 opacity-0 transition-all group-hover:-translate-y-2 group-hover:opacity-100">
              <Button size="sm" variant="ghost" className="">
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="hover:bg-red-900 active:bg-red-900"
                onClick={() => handleDeleteGoal(goal.id)}
                disabled={isDeletingGoal && deleteGoalVariables?.id === goal.id}
                loading={isDeletingGoal && deleteGoalVariables?.id === goal.id}
                hideContentWhenLoading
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <div className="">
          <Button
            onClick={onCreateGoal}
            disabled={isCreatingGoal}
            variant="ghost"
            size={"sm"}
            className="flex items-center gap-2 text-sm font-normal"
          >
            <Plus className="h-4 w-4" /> Add Goal
          </Button>
        </div>
      </div>
    </div>
  );
};

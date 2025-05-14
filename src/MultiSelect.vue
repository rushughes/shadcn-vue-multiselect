<script setup lang="ts">
import { ref, computed, toRaw } from 'vue'
import { Check, ChevronDown, X, XCircle, Sparkles } from 'lucide-vue-next'

import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'

export interface MultiSelectOption {
  label: string
  value: string
  icon?: any
}

const props = withDefaults(defineProps<{
  options: MultiSelectOption[]
  modelValue: string[]
  placeholder?: string
  animation?: number
  maxCount?: number
}>(), {
  placeholder: 'Select options',
  animation: 0,
  maxCount: 3
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const isAnimating = ref(false)
const search = ref('')

const filteredOptions = computed(() =>
  props.options.filter(opt =>
    opt.label.toLowerCase().includes(search.value.toLowerCase())
  )
)

const arraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((v, i) => v === b[i])

const toggleOption = (value: string) => {
  const current = [...toRaw(props.modelValue)]
  const exists = current.includes(value)
  const updated = exists
    ? current.filter(v => v !== value)
    : [...current, value]

  console.log('TOGGLE_OPTION', { current, updated, exists })

  if (!arraysEqual(updated, current)) {
    emit('update:modelValue', updated)
  }
}

const handleClear = () => {
  console.log('HANDLE_CLEAR', props.modelValue)
  if (props.modelValue.length > 0) {
    emit('update:modelValue', [])
  }
}

const toggleAll = () => {
  const all = props.options.map(opt => opt.value)
  const current = [...toRaw(props.modelValue)].sort()
  const allSorted = [...all].sort()
  const isAllSelected = arraysEqual(current, allSorted)
  const updated = isAllSelected ? [] : allSorted

  console.log('TOGGLE_ALL', { current, allSorted, isAllSelected, updated })

  if (!arraysEqual(current, updated)) {
    emit('update:modelValue', updated)
  }
}

const clearExtra = () => {
  console.log('CLEAR_EXTRA', props.modelValue)
  emit('update:modelValue', props.modelValue.slice(0, props.maxCount))
}
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <Button variant="outline" class="w-full justify-between">
        <div class="flex flex-wrap gap-1">
          <slot name="badge" v-for="val in props.modelValue.slice(0, props.maxCount)" :key="val">
            <Badge
              class="flex items-center gap-1"
              :class="{ 'animate-bounce': isAnimating }"
              :style="{ animationDuration: `${props.animation}s` }"
            >
              {{ props.options.find(o => o.value === val)?.label }}
              <XCircle class="w-4 h-4 ml-1 cursor-pointer" @click.stop="toggleOption(val)" />
            </Badge>
          </slot>
          <Badge
            v-if="props.modelValue.length > props.maxCount"
            class="flex items-center gap-1 border"
            :class="{ 'animate-bounce': isAnimating }"
          >
            +{{ props.modelValue.length - props.maxCount }} more
            <XCircle class="w-4 h-4 ml-1 cursor-pointer" @click.stop="clearExtra" />
          </Badge>
          <span v-if="!props.modelValue.length" class="text-muted-foreground text-sm">
            {{ props.placeholder }}
          </span>
        </div>
        <ChevronDown class="w-4 h-4 ml-auto" />
      </Button>
    </PopoverTrigger>

    <PopoverContent class="w-[300px] p-0">
      <Command>
        <CommandInput v-model="search" placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup>
            <CommandItem :value="'__all__'" @mousedown.prevent="toggleAll">
              <div
                class="mr-2 h-4 w-4 rounded-sm border flex items-center justify-center"
                :class="{
                  'bg-primary text-primary-foreground': props.modelValue.length === props.options.length,
                  'opacity-50': props.modelValue.length !== props.options.length
                }"
              >
                <Check class="h-4 w-4" />
              </div>
              <span>(Select All)</span>
            </CommandItem>

            <template v-for="opt in filteredOptions" :key="opt.value">
              <slot name="option" :option="opt" :selected="props.modelValue.includes(opt.value)">
                <CommandItem :value="opt.value" @mousedown.prevent="toggleOption(opt.value)">
                  <div
                    class="mr-2 h-4 w-4 rounded-sm border flex items-center justify-center"
                    :class="{
                      'bg-primary text-primary-foreground': props.modelValue.includes(opt.value),
                      'opacity-50': !props.modelValue.includes(opt.value)
                    }"
                  >
                    <Check class="h-4 w-4" />
                  </div>
                  <slot name="icon" :option="opt" />
                  <span>{{ opt.label }}</span>
                </CommandItem>
              </slot>
            </template>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup>
            <div class="flex items-center justify-between px-2">
              <Button
                v-if="props.modelValue.length"
                variant="ghost"
                class="text-red-500 text-xs"
                @click="handleClear"
              >
                Clear
              </Button>
              <Button
                variant="ghost"
                class="text-xs"
                @click="isOpen = false"
              >
                Close
              </Button>
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>

    <Sparkles
      v-if="props.animation > 0 && props.modelValue.length"
      class="w-4 h-4 mt-1 ml-1 cursor-pointer"
      :class="isAnimating ? 'text-foreground' : 'text-muted-foreground'"
      @click="isAnimating = !isAnimating"
    />
  </Popover>
</template>

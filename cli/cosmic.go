package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/charmbracelet/bubbles/list"
	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/tea-latte"
	"github.com/lucasb-eyer/go-colorful"
)

// task represents a single task in our cosmic orbit
type Task struct {
	ID		  int    	`json:"id"`
	Title     string 	`json:"title"`
	Priority  int    	`json:"priority"`
	Status	  string 	`json:"status"`
	CreatedAt time.Time `json:"created_at"`
	DueDate   time.Time `json:"due_date,omitempty"`
}

// taskstore handles saving and loading tasks
type TaskStore struct {
	Tasks 	  []Task    `json:"tasks"`
	NextID 	  int       `json:"next_id"`
	FilePath  string    `json:"file_path"`
}

// model represents application state
type Model struct {
	tasks     []Task
	store     TaskStore
	list      list.Model
	textInput textinput.Model
	priorityNum int
	editing   bool
	editID    int
	err       error
}

// for list implementation
type item struct {
	task Task
}

func (i item) Title() string {
	prioritySymbols := map[int]string{
		1: "🌟", // inner orbit (highest priority)
		2: "⭐️", // middle orbit
		3: "✨", // outer orbit (lowest priority)
	}

	symbol := prioritySymbols[i.task.Priority]
	dueStr := ""

	if !i.task.DueDate.IsZero() {
		daysUntil := int(i.task.DueDate.Sub(time.Now()).Hours() / 24)
		if daysUntil < 0 {
			dueStr = lipgloss.NewStyle().Foreground(lipgloss.Color("#FF0000")).Render(fmt.Sprintf(" [%dd overdue]", -daysUntil))
		} else if daysUntil == 0 {
			dueStr = lipgloss.NewStyle().Foreground(lipgloss.Color("#FF7F00")).Render(" [due today]")
		} else if daysUntil <== 2{
			dueStr = lipgloss.NewStyle().Foreground(lipgloss.Color("#FFFF00")).Render(fmt.Sprintf(" [%dd overdue]", daysUntil))
		}
	}

	return symbol + i.task.Title + dueStr
}

func (i item) Description() string {
	var sb strings.Builder
	sb.WriteString("Orbit: ")
	
	orbitNames := map[int]string{
		1: "Inner Orbit",
		2: "Middle Orbit",
		3: "Outer Orbit",
	}

	orbitStr := lipgloss.NewStyle().Foreground(lipgloss.Color("#5F9EA0")).Render(orbitNames[i.task.Priority])
	sb.WriteString(orbitStr)

	if !i.task.DueDate.IsZero() {
		sb.WriteString(" | Due: ")
		sb.WriteString(lipgloss.NewStyle().Foreground(lipgloss.Color("#ADD8E6")).Render(i.task.DueDate.Format("2006-01-02")))
	}

	sb.WriteString(" | Status: ")

	statusColors := map[string]string{	
		"pending": "#FF0000",
		"in progress": "#00FF00",
		"completed": "#7F7F7F",
	}

	statusStr := lipgloss.NewStyle().Foreground(lipgloss.Color(statusColors[i.task.Status])).Render(i.task.Status)
	sb.WriteString(statusStr)

	return sb.String()
}

func (i item) FilterValue() string { return i.task.Title }

// initialize the app
func initialModel() Model {
	listModel := list.New([]list.Item{}, list.NewDefaultDelegate(), 0, 0)
	listModel.Title = "🌌 Task Orbit 🌌"

	ti := textinput.New()
	ti.PlaceHolder = "Add a new task..."
	ti.Focus()
	ti.Width = 50
	ti.CharLimit = 100

	// load tasks from file
	store := TaskStore{FilePath: "tasks.json"}
	store.Load()

	var items []list.Item
	for _, t := range store.Tasks {
		items = append(items, item{task: t})
	}	
	listModel.SetItems(items)
}
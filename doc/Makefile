DOT := $(wildcard *.dot)
SVG := $(DOT:.dot=.svg)
PNG := $(DOT:.dot=.png)
QMD := main.qmd
HTML := $(QMD:.qmd=.html)

.PHONY: all diagrams html clean

all: diagrams html

diagrams: $(SVG) $(PNG)

%.svg: %.dot
	dot -Tsvg $< -o $@

%.png: %.dot
	dot -Tpng $< -o $@

$(HTML): $(QMD) $(SVG)
	quarto render $(QMD)

html: $(HTML)

clean:
	rm -f $(SVG) $(PNG) $(HTML)
